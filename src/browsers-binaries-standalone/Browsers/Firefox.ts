import {_, Path, RequestPromise, Url, Globule, FS} from "../externals";
import {Helpers} from "../exports"
import {BrowserBase, Platform} from "./Browsers";

export class Firefox extends BrowserBase {

    private language;
    constructor(platform: Platform, version: string, language: string = "en-US") {
        super("Firefox", platform, version);
        this.language = language;
    }

    private getBinariesUrl() {
        let platform: string;
        switch(this.platform) {
            case Platform.Win:
                platform = "win32"; break;
            case Platform.Win_x64:
                platform = `win64`; break;
            case Platform.Linux:
                platform = `linux-i686`; break
            case Platform.Linux_x64:
                platform = `linux-x86_64`; break
            case Platform.Mac:
                platform = `mac`; break
        }

        let fileName: string
        switch(this.platform) {
            case Platform.Win:
            case Platform.Win_x64:
                fileName = `Firefox Setup ${this.version}.exe`; break;
            case Platform.Linux:
            case Platform.Linux_x64:
                fileName = `firefox-${this.version}.tar.bz2`; break;
            case Platform.Mac:
                fileName = `Firefox ${this.version}.dmg`; break;
        }

        let result = `https://ftp.mozilla.org/pub/firefox/releases/${this.version}/${platform}/${this.language}/${encodeURIComponent(fileName)}`;
        return result;
    }

    public install() {
        return this.installBase(() => {
            let url = this.getBinariesUrl();
            return this.downloadFile(url, path => this.unzipFile(path, ["*", "![cC]ore", "![fF]irefox"]));
        });
    }

    public getExecutablePath() {
        return this.getExecutablePathByGlob(["*/[fF]irefox", "*/[fF]irefox.exe", "**/MacOS/[fF]irefox"]);
    }
}