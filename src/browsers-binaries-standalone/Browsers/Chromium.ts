import {_, Promise, Path, RequestPromise, Url, FS, Globule, Googleapis, Chalk} from "../externals";
import {Helpers} from "../exports"
import {BrowserBase, Platform} from "./Browsers";

export class Chromium extends BrowserBase {
    constructor(platform: Platform, version: string, path?: string) {
        super("Chromium", platform, version, path);
    }

    public static getVersionInformation(version: string) {
        let options: RequestPromise.Options = {
            uri: "https://omahaproxy.appspot.com/deps.json?version=" + version,
            json: true,
            transform: (result: IVersionInformation) => {
                result.chromium_base_position = parseInt(<any>result.chromium_base_position, 10);
                result.v8_position = parseInt(<any>result.v8_position, 10);
                return result;
            }
        };
        return RequestPromise(options).then((result: IVersionInformation) => result);
    }

    private getBinariesPlatformPath() {
        switch(this.platform) {
            case Platform.Win: return "Win";
            case Platform.Win_x64: return "Win_x64";
            case Platform.Linux: return "Linux";
            case Platform.Linux_x64: return "Linux_x64";
            case Platform.Mac: return "Mac";
        }
    }

    private getBinariesPositions(bucket: string) {
        let defer = Promise.defer();
        let storage = Googleapis.storage('v1');
        let prefix = this.getBinariesPlatformPath() + "/";
        let positions: number[] = [];

        (function getStorageObjectsRecursise(pageToken?: string) {
            var request = {
                bucket: bucket,
                prefix: prefix,
                delimiter: "/",
                pageToken: pageToken,
                maxResults: 1000
            };

            storage.objects.list(request, (error, result) => {
                if(error) {
                    return defer.reject(error);
                }

                let prefixes: string[] = result.prefixes;
                positions = positions.concat(prefixes.map(x => parseInt(x.replace(prefix, ""))).filter(x=> !isNaN(x)));
                if(result.nextPageToken) {
                    return getStorageObjectsRecursise(result.nextPageToken);
                } else {
                    return defer.resolve(positions);
                }
            });
        })();

        return defer.promise;
    }

    private getBinariesUrl(position: number) {
        let buckets = ["chromium-browser-continuous", "chromium-browser-snapshots"];
        return Promise.try(() => {
            let urls =  buckets.map(bucket => this.getBinariesUrlByPosition(bucket, position));
            return (function check(index: number) {
                return Promise.resolve(urls[index]).then(url => RequestPromise({ uri: urls[index], method: "HEAD" })
                    .then(() => url, (error) => index >= (urls.length - 1) ? Promise.reject(error) : check(index + 1)))
            })(0);
        }).catch(() => {
            this.log(`Searching the nearest branch base position for ${this.getFullName()} ${this.version} (${position})..`);
            return Promise.all(buckets.map(x => this.getBinariesPositions(x)))
                .then(result => {
                    let positions = result.map((bucketPos: number[]) => bucketPos.filter(x => x <= position));
                    let maxPositions = positions.map(_.max);
                    position = _.max(maxPositions);
                    let bucket = buckets[maxPositions.indexOf(position)];
                    this.log(`Branch base position found on "${bucket}" (${position})`);
                    return bucket;
                })
                .then(bucket => this.getBinariesUrlByPosition(bucket, position));
        });
    }

    private getBinariesUrlByPosition(bucket: string, position: number) {
        let path: string = this.getBinariesPlatformPath() + "/" + position + "/";
        switch(this.platform) {
            case Platform.Win:
            case Platform.Win_x64:
                path += `chrome-win32.zip`; break;
            case Platform.Linux:
            case Platform.Linux_x64:
                path += `chrome-linux.zip`; break
            case Platform.Mac:
                path += `chrome-mac.zip`; break
        }

        let url = `https://www.googleapis.com/download/storage/v1/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
        return url;
    }

    public install() {
        return this.installBase(() =>
            Chromium.getVersionInformation(this.version)
                .then(info => this.getBinariesUrl(info.chromium_base_position))
                .then(url => this.downloadFile(url, path => this.unzipFile(path, ["*","![cC]hrome-*"]))));
    }

    public getExecutablePath() {
        return this.getExecutablePathByGlob(["*/[cC]hrome", "*/[cC]hrome.exe", "**/MacOS/[cC]hromium"]);
    }
}

export interface IVersionInformation{
    chromium_version: string,
    skia_commit: string,
    chromium_base_position: number,
    v8_version: string,
    chromium_branch: string,
    v8_position: number,
    chromium_base_commit: string,
    chromium_commit: string
}