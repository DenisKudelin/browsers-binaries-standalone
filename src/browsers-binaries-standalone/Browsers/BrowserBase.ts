import {_, FS, Path, RequestPromise, Url, Chalk, Mkdirp, Rimraf, SevenZip, Promise, Globule} from "../externals";
import {Helpers} from "../exports"
import {Platform} from "./Browsers";

export abstract class BrowserBase {
    public version: string;
    public platform: Platform;

    private name: string;

    constructor(name: string, platform: Platform, version: string) {
        this.name = name;
        this.version = version;
        this.platform = platform;
        if(!platform) {
            throw new Error("Browser platform must be specified!");
        }

        if(!version) {
            throw new Error("Browser version must be specified!");
        }
    }

    public abstract getExecutablePath(): string;
    public abstract install(): Promise<void>;

    public getBinariesPath(path = "") {
        return Path.join(__dirname, "../../../browsers/" + this.name.toLowerCase(),
            this.version.toLowerCase() + "-" + Platform[this.platform].toLowerCase(), path);
    }

    public isDownloaded() {
        return FS.existsSync(this.getExecutablePath());
    }

    protected getExecutablePathByGlob(glob: string | string[]) {
        let basePath = this.getBinariesPath();
        let path = Globule.find(glob, { srcBase: basePath })[0];
        return path && this.getBinariesPath(path);
    }

    protected installBase(install: () => Promise<void>) {
        return Promise.try(() => {
            this.log(`=========================================`);
            if(this.isDownloaded()) {
                this.log(`${this.getFullName()} ${this.version} binaries are already installed`);
                return;
            }

            this.log(`${this.getFullName()} ${this.version} installation starting`);
            return install().then(() => this.log(`${this.getFullName()} ${this.version} installation finished`));
        }).then(() => {
            this.log(`Executable path: ${this.getExecutablePath()}`);
            this.log(`=========================================\n\n`);
        });
    }

    protected downloadFile(url: string, unpack: (path: string) => Promise<any>) {
        let path = this.getBinariesPath(this.getFullName(true));
        if(FS.existsSync(path)) {
            return unpack(path);
        }

        return Promise.resolve()
            .then(() => Rimraf.sync(Path.dirname(path))).delay(10)
            .then(() => Mkdirp.sync(Path.dirname(path)))
            .then(() => {
                let options: RequestPromise.Options = {
                    uri: url
                };

                let request = RequestPromise(options);

                let fileStream = FS.createWriteStream(path, {'flags': 'a'});
                let totalBytes;
                let downloadedBytes = 0;
                request.pipe(fileStream);

                request.on("response", data => {
                    totalBytes = parseInt(data.headers["content-length"]);
                    this.log(`Downloading ${this.getFullName()} (${Helpers.autoFormatSize(totalBytes)})..`);
                });

                request.on("data", (chunk) => {
                    downloadedBytes += chunk.length;
                });

                request.on("end", () => {
                    this.log(`Finished downloading ${this.getFullName()}`);
                    fileStream.close();
                });

                return request.then(() => unpack(path));
            });
    }

    protected unzipFile(path: string, clear: string[] | string): Promise<void> {
        this.log(`Unpacking ${this.getFullName()}..`);
        let defer = Promise.defer();
        let dirPath = Path.dirname(path);

        return SevenZip.extract(path, dirPath)
            .then(() => {
                if(FS.existsSync(path + "~")) {
                    return SevenZip.extract(path + "~", dirPath);
                }
            })
            .then(() => {
                this.log(`Finished unpacking ${this.getFullName(true)}`);
            })
            .delay(10)
            .then(() => {
                if(!clear) {
                    return;
                }

                let filesToDelete = Globule.find(clear, { srcBase: dirPath })
                    .map(x => Path.isAbsolute(x) ? x : Path.join(dirPath, x));
                filesToDelete.forEach(x => Rimraf.sync(x));
            });
    }

    protected getFullName(lowerCase: boolean = false) {
        let result = this.name + "-" + Platform[this.platform];
        return lowerCase ? result.toLowerCase() : result;
    }

    protected log(message: string) {
        console.log(Chalk.yellow(message));
    }
}