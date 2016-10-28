"use strict";
var externals_1 = require("./externals");
var Browsers_1 = require("./Browsers/Browsers");
exports.Platform = Browsers_1.Platform;
exports.Chromium = Browsers_1.Chromium;
exports.Firefox = Browsers_1.Firefox;
function create(configOrPath, configOrPathEx) {
    if (!configOrPath) {
        throw new Error("Config must be specified!");
    }
    var config = externals_1._.isString(configOrPath) ? externals_1._.clone(require(configOrPath)) : configOrPath;
    if (configOrPathEx) {
        var configEx = externals_1._.isString(configOrPathEx) ? externals_1._.clone(require(configOrPathEx)) : configOrPathEx;
        externals_1._.extendWith(config, configEx, function (obj, src) {
            if (!externals_1._.isArray(obj) && !externals_1._.isArray(src)) {
                return externals_1._.extend(obj, src);
            }
            return obj.concat(src);
        });
    }
    if (!config.browsers) {
        throw new Error("Config.browsers must be specified!");
    }
    var browsers = config.browsers.map(function (cfg) {
        switch (cfg.name.toLowerCase()) {
            case "chromium": return new Browsers_1.Chromium(Browsers_1.Platform[cfg.platform], cfg.version);
            case "firefox": return new Browsers_1.Firefox(Browsers_1.Platform[cfg.platform], cfg.version, cfg.language);
        }
    });
    return browsers;
}
exports.create = create;
function install(configOrPath, configOrPathEx) {
    return externals_1.Promise.each(create(configOrPath, configOrPathEx), function (browser) { return browser.install().then(function () { return browser; }); });
}
exports.install = install;
