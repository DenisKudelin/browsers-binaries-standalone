import {_, Path, Url, Promise} from "./externals";
import {Platform, Chromium, Firefox, BrowserBase} from "./Browsers/Browsers";
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

    let createFns = {
        chromium: (cfg: IInstallBrowsersConfig) =>
            new Chromium(Platform[cfg.platform], cfg.version, config.defaultPath || cfg.path),
        firefox: (cfg: IInstallBrowsersConfig) =>
            new Firefox(Platform[cfg.platform], cfg.version, cfg.language, config.defaultPath || cfg.path)
    };

    let browsers = _.flatten(_.keys(config).filter(key => config[key] && createFns[key]).map(key => {
        let installConfigs: IInstallBrowsersConfig[] = _.isArray(config[key]) ? config[key] : [config[key]];
        return installConfigs.map(cfg => <BrowserBase>createFns[key](cfg));
    }));

    return browsers;
}

export function install(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string) {
    return Promise.each(create(configOrPath, configOrPathEx), browser => browser.install().then(() => browser));
}

export interface IInstallConfig {
    firefox: IInstallBrowsersConfig | IInstallBrowsersConfig[];
    chromium: IInstallBrowsersConfig | IInstallBrowsersConfig[];
    defaultPath: string;
}

export interface IInstallBrowsersConfig {
    version: string;
    platform: string;
    language?: string;
    path?: string;
}