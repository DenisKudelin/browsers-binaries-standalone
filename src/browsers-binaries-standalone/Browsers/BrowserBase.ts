import {_, FS, Path, RequestPromise, Url, Chalk, Mkdirp, Rimraf, SevenZip, Promise, Globule} from "../externals";
import {Helpers, ProgressLog} from "../exports"
import {Platform} from "./Browsers";

export abstract class BrowserBase {
    public version: string;
    public platform: Platform;
    protected versionSuffix: string;
    private name: string;
    private path: string;

    constructor(name: string, platform: Platform, version: string, path?: string) {
        this.name = name;
        this.version = version;
        this.platform = platform;
        this.path = path || Path.join(__dirname, "../../../browsers/");
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
        let versionName = `${this.version.toLowerCase()}_${Platform[this.platform].toLowerCase()}${(this.versionSuffix || "")}`;
        return Path.join(this.path, this.name.toLowerCase(), versionName , path);
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
        /*if(FS.existsSync(path)) {
            return unpack(path);
        }*/

        return Promise.resolve()
            .then(() => Rimraf.sync(Path.dirname(path))).delay(10)
            .then(() => Mkdirp.sync(Path.dirname(path)))
            .then(() => {
                let options: RequestPromise.Options = {
                    uri: url,
                    timeout: 10000
                };

                let request = RequestPromise(options);

                let fileStream = FS.createWriteStream(path, {'flags': 'a'});
                let progress = new ProgressLog();
                request.pipe(fileStream);

                request.on("response", data => {
                    let totalBytes = parseInt(data.headers["content-length"]);
                    this.log(`Downloading ${this.getFullName()} (${Helpers.autoFormatSize(totalBytes)})..`);
                    progress.init(totalBytes);
                });

                request.on("data", (chunk) => {
                    progress.progress(chunk.length);
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