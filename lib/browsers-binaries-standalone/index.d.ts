import { Promise } from "./externals";
import { Platform, Chromium, Firefox, BrowserBase } from "./Browsers/Browsers";
export { Chromium, Firefox, Platform };
export declare function create(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string): BrowserBase[];
export declare function install(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string): Promise<BrowserBase[]>;
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
