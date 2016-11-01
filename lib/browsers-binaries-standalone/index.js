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
    var createFns = {
        chromium: function (cfg) {
            return new Browsers_1.Chromium(Browsers_1.Platform[cfg.platform], cfg.version, config.defaultPath || cfg.path);
        },
        firefox: function (cfg) {
            return new Browsers_1.Firefox(Browsers_1.Platform[cfg.platform], cfg.version, cfg.language, config.defaultPath || cfg.path);
        }
    };
    var browsers = externals_1._.flatten(externals_1._.keys(config).filter(function (key) { return config[key] && createFns[key]; }).map(function (key) {
        var installConfigs = externals_1._.isArray(config[key]) ? config[key] : [config[key]];
        return installConfigs.map(function (cfg) { return createFns[key](cfg); });
    }));
    return browsers;
}
exports.create = create;
function install(configOrPath, configOrPathEx) {
    return externals_1.Promise.each(create(configOrPath, configOrPathEx), function (browser) { return browser.install().then(function () { return browser; }); });
}
exports.install = install;
