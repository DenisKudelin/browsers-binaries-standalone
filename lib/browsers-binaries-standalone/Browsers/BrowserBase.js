"use strict";
var externals_1 = require("../externals");
var exports_1 = require("../exports");
var Browsers_1 = require("./Browsers");
var BrowserBase = (function () {
    function BrowserBase(name, platform, version) {
        this.name = name;
        this.version = version;
        this.platform = platform;
        if (!platform) {
            throw new Error("Browser platform must be specified!");
        }
        if (!version) {
            throw new Error("Browser version must be specified!");
        }
    }
    BrowserBase.prototype.getBinariesPath = function (path) {
        if (path === void 0) { path = ""; }
        return externals_1.Path.join(__dirname, "../../../browsers/" + this.name.toLowerCase(), this.version.toLowerCase() + "-" + Browsers_1.Platform[this.platform].toLowerCase(), path);
    };
    BrowserBase.prototype.isDownloaded = function () {
        return externals_1.FS.existsSync(this.getExecutablePath());
    };
    BrowserBase.prototype.getExecutablePathByGlob = function (glob) {
        var basePath = this.getBinariesPath();
        var path = externals_1.Globule.find(glob, { srcBase: basePath })[0];
        return path && this.getBinariesPath(path);
    };
    BrowserBase.prototype.installBase = function (install) {
        var _this = this;
        return externals_1.Promise.try(function () {
            _this.log("=========================================");
            if (_this.isDownloaded()) {
                _this.log(_this.getFullName() + " " + _this.version + " binaries are already installed");
                return;
            }
            _this.log(_this.getFullName() + " " + _this.version + " installation starting");
            return install().then(function () { return _this.log(_this.getFullName() + " " + _this.version + " installation finished"); });
        }).then(function () {
            _this.log("Executable path: " + _this.getExecutablePath());
            _this.log("=========================================\n\n");
        });
    };
    BrowserBase.prototype.downloadFile = function (url, unpack) {
        var _this = this;
        var path = this.getBinariesPath(this.getFullName(true));
        if (externals_1.FS.existsSync(path)) {
            return unpack(path);
        }
        return externals_1.Promise.resolve()
            .then(function () { return externals_1.Rimraf.sync(externals_1.Path.dirname(path)); }).delay(10)
            .then(function () { return externals_1.Mkdirp.sync(externals_1.Path.dirname(path)); })
            .then(function () {
            var options = {
                uri: url
            };
            var request = externals_1.RequestPromise(options);
            var fileStream = externals_1.FS.createWriteStream(path, { 'flags': 'a' });
            var totalBytes;
            var downloadedBytes = 0;
            request.pipe(fileStream);
            request.on("response", function (data) {
                totalBytes = parseInt(data.headers["content-length"]);
                _this.log("Downloading " + _this.getFullName() + " (" + exports_1.Helpers.autoFormatSize(totalBytes) + ")..");
            });
            request.on("data", function (chunk) {
                downloadedBytes += chunk.length;
            });
            request.on("end", function () {
                _this.log("Finished downloading " + _this.getFullName());
                fileStream.close();
            });
            return request.then(function () { return unpack(path); });
        });
    };
    BrowserBase.prototype.unzipFile = function (path, clear) {
        var _this = this;
        this.log("Unpacking " + this.getFullName() + "..");
        var defer = externals_1.Promise.defer();
        var dirPath = externals_1.Path.dirname(path);
        return externals_1.SevenZip.extract(path, dirPath)
            .then(function () {
            if (externals_1.FS.existsSync(path + "~")) {
                return externals_1.SevenZip.extract(path + "~", dirPath);
            }
        })
            .then(function () {
            _this.log("Finished unpacking " + _this.getFullName(true));
        })
            .delay(10)
            .then(function () {
            if (!clear) {
                return;
            }
            var filesToDelete = externals_1.Globule.find(clear, { srcBase: dirPath })
                .map(function (x) { return externals_1.Path.isAbsolute(x) ? x : externals_1.Path.join(dirPath, x); });
            filesToDelete.forEach(function (x) { return externals_1.Rimraf.sync(x); });
        });
    };
    BrowserBase.prototype.getFullName = function (lowerCase) {
        if (lowerCase === void 0) { lowerCase = false; }
        var result = this.name + "-" + Browsers_1.Platform[this.platform];
        return lowerCase ? result.toLowerCase() : result;
    };
    BrowserBase.prototype.log = function (message) {
        console.log(externals_1.Chalk.yellow(message));
    };
    return BrowserBase;
}());
exports.BrowserBase = BrowserBase;
