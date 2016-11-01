"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var externals_1 = require("../externals");
var Browsers_1 = require("./Browsers");
var Chromium = (function (_super) {
    __extends(Chromium, _super);
    function Chromium(platform, version, path) {
        _super.call(this, "Chromium", platform, version, path);
    }
    Chromium.getVersionInformation = function (version) {
        var options = {
            uri: "https://omahaproxy.appspot.com/deps.json?version=" + version,
            json: true,
            transform: function (result) {
                result.chromium_base_position = parseInt(result.chromium_base_position, 10);
                result.v8_position = parseInt(result.v8_position, 10);
                return result;
            }
        };
        return externals_1.RequestPromise(options).then(function (result) { return result; });
    };
    Chromium.prototype.getBinariesPlatformPath = function () {
        switch (this.platform) {
            case Browsers_1.Platform.Win: return "Win";
            case Browsers_1.Platform.Win_x64: return "Win_x64";
            case Browsers_1.Platform.Linux: return "Linux";
            case Browsers_1.Platform.Linux_x64: return "Linux_x64";
            case Browsers_1.Platform.Mac: return "Mac";
        }
    };
    Chromium.prototype.getBinariesPositions = function (bucket) {
        var defer = externals_1.Promise.defer();
        var storage = externals_1.Googleapis.storage('v1');
        var prefix = this.getBinariesPlatformPath() + "/";
        var positions = [];
        (function getStorageObjectsRecursise(pageToken) {
            var request = {
                bucket: bucket,
                prefix: prefix,
                delimiter: "/",
                pageToken: pageToken,
                maxResults: 1000
            };
            storage.objects.list(request, function (error, result) {
                if (error) {
                    return defer.reject(error);
                }
                var prefixes = result.prefixes;
                positions = positions.concat(prefixes.map(function (x) { return parseInt(x.replace(prefix, "")); }).filter(function (x) { return !isNaN(x); }));
                if (result.nextPageToken) {
                    return getStorageObjectsRecursise(result.nextPageToken);
                }
                else {
                    return defer.resolve(positions);
                }
            });
        })();
        return defer.promise;
    };
    Chromium.prototype.getBinariesUrl = function (position) {
        var _this = this;
        var buckets = ["chromium-browser-continuous", "chromium-browser-snapshots"];
        return externals_1.Promise.try(function () {
            var urls = buckets.map(function (bucket) { return _this.getBinariesUrlByPosition(bucket, position); });
            return (function check(index) {
                return externals_1.Promise.resolve(urls[index]).then(function (url) { return externals_1.RequestPromise({ uri: urls[index], method: "HEAD" })
                    .then(function () { return url; }, function (error) { return index >= (urls.length - 1) ? externals_1.Promise.reject(error) : check(index + 1); }); });
            })(0);
        }).catch(function () {
            _this.log("Searching the nearest branch base position for " + _this.getFullName() + " " + _this.version + " (" + position + ")..");
            return externals_1.Promise.all(buckets.map(function (x) { return _this.getBinariesPositions(x); }))
                .then(function (result) {
                var positions = result.map(function (bucketPos) { return bucketPos.filter(function (x) { return x <= position; }); });
                var maxPositions = positions.map(externals_1._.max);
                position = externals_1._.max(maxPositions);
                var bucket = buckets[maxPositions.indexOf(position)];
                _this.log("Branch base position found on \"" + bucket + "\" (" + position + ")");
                return bucket;
            })
                .then(function (bucket) { return _this.getBinariesUrlByPosition(bucket, position); });
        });
    };
    Chromium.prototype.getBinariesUrlByPosition = function (bucket, position) {
        var path = this.getBinariesPlatformPath() + "/" + position + "/";
        switch (this.platform) {
            case Browsers_1.Platform.Win:
            case Browsers_1.Platform.Win_x64:
                path += "chrome-win32.zip";
                break;
            case Browsers_1.Platform.Linux:
            case Browsers_1.Platform.Linux_x64:
                path += "chrome-linux.zip";
                break;
            case Browsers_1.Platform.Mac:
                path += "chrome-mac.zip";
                break;
        }
        var url = "https://www.googleapis.com/download/storage/v1/b/" + bucket + "/o/" + encodeURIComponent(path) + "?alt=media";
        return url;
    };
    Chromium.prototype.install = function () {
        var _this = this;
        return this.installBase(function () {
            return Chromium.getVersionInformation(_this.version)
                .then(function (info) { return _this.getBinariesUrl(info.chromium_base_position); })
                .then(function (url) { return _this.downloadFile(url, function (path) { return _this.unzipFile(path, ["*", "![cC]hrome-*"]); }); });
        });
    };
    Chromium.prototype.getExecutablePath = function () {
        return this.getExecutablePathByGlob(["*/[cC]hrome", "*/[cC]hrome.exe", "**/MacOS/[cC]hromium"]);
    };
    return Chromium;
}(Browsers_1.BrowserBase));
exports.Chromium = Chromium;
