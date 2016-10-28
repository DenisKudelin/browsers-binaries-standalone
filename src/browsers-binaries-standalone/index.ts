import {_, Path, Url, Promise} from "./externals";
import {Platform, Chromium, Firefox} from "./Browsers/Browsers";
export {Chromium, Firefox, Platform};

export function create(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string) {
    if(!configOrPath) {
        throw new Error("Config must be specified!");
    }

    let config: IInstallConfig = _.isString(configOrPath) ? _.clone(require(configOrPath)) : configOrPath;
    if(configOrPathEx) {
        let configEx: IInstallConfig = _.isString(configOrPathEx) ? _.clone(require(configOrPathEx)) : configOrPathEx;
        _.extendWith(config, configEx, (obj: any[], src: any[]) => {
            if(!_.isArray(obj) && !_.isArray(src)) {
                return _.extend(obj, src);
            }

            return obj.concat(src);
        });
    }

    if(!config.browsers) {
        throw new Error("Config.browsers must be specified!");
    }

    let browsers = config.browsers.map(cfg => {
        switch(cfg.name.toLowerCase()) {
            case "chromium": return new Chromium(Platform[cfg.platform], cfg.version);
            case "firefox": return new Firefox(Platform[cfg.platform], cfg.version, cfg.language);
        }
    });

    return browsers;
}

export function install(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string) {
    return Promise.each(create(configOrPath, configOrPathEx), browser => browser.install().then(() => browser));
}

export interface IInstallConfig {
    browsers: IInstallBrowsersConfig[];
}

export interface IInstallBrowsersConfig {
    name: string;
    version: string;
    platform: string;
    language?: string;
}