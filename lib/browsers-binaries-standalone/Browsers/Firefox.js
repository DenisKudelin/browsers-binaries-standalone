"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Browsers_1 = require("./Browsers");
var Firefox = (function (_super) {
    __extends(Firefox, _super);
    function Firefox(platform, version, language, path) {
        _super.call(this, "Firefox", platform, version, path);
        this.language = language || "en-US";
        this.versionSuffix = "_" + this.language;
    }
    Firefox.prototype.getBinariesUrl = function () {
        var platform;
        switch (this.platform) {
            case Browsers_1.Platform.Win:
                platform = "win32";
                break;
            case Browsers_1.Platform.Win_x64:
                platform = "win64";
                break;
            case Browsers_1.Platform.Linux:
                platform = "linux-i686";
                break;
            case Browsers_1.Platform.Linux_x64:
                platform = "linux-x86_64";
                break;
            case Browsers_1.Platform.Mac:
                platform = "mac";
                break;
        }
        var fileName;
        switch (this.platform) {
            case Browsers_1.Platform.Win:
            case Browsers_1.Platform.Win_x64:
                fileName = "Firefox Setup " + this.version + ".exe";
                break;
            case Browsers_1.Platform.Linux:
            case Browsers_1.Platform.Linux_x64:
                fileName = "firefox-" + this.version + ".tar.bz2";
                break;
            case Browsers_1.Platform.Mac:
                fileName = "Firefox " + this.version + ".dmg";
                break;
        }
        var result = "https://ftp.mozilla.org/pub/firefox/releases/" + this.version + "/" + platform + "/" + this.language + "/" + encodeURIComponent(fileName);
        return result;
    };
    Firefox.prototype.install = function () {
        var _this = this;
        return this.installBase(function () {
            var url = _this.getBinariesUrl();
            return _this.downloadFile(url, function (path) { return _this.unzipFile(path, ["*", "![cC]ore", "![fF]irefox"]); });
        });
    };
    Firefox.prototype.getExecutablePath = function () {
        return this.getExecutablePathByGlob(["*/[fF]irefox", "*/[fF]irefox.exe", "**/MacOS/[fF]irefox"]);
    };
    return Firefox;
}(Browsers_1.BrowserBase));
exports.Firefox = Firefox;
