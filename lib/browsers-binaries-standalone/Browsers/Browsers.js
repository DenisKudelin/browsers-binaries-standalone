"use strict";
var BrowserBase_1 = require("./BrowserBase");
exports.BrowserBase = BrowserBase_1.BrowserBase;
var Chromium_1 = require("./Chromium");
exports.Chromium = Chromium_1.Chromium;
var Firefox_1 = require("./Firefox");
exports.Firefox = Firefox_1.Firefox;
(function (Platform) {
    Platform[Platform["Win"] = 0] = "Win";
    Platform[Platform["Win_x64"] = 1] = "Win_x64";
    Platform[Platform["Linux"] = 2] = "Linux";
    Platform[Platform["Linux_x64"] = 3] = "Linux_x64";
    Platform[Platform["Mac"] = 4] = "Mac";
})(exports.Platform || (exports.Platform = {}));
var Platform = exports.Platform;
