import { Promise } from "./externals";
import { Platform, Chromium, Firefox } from "./Browsers/Browsers";
export { Chromium, Firefox, Platform };
export declare function create(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string): (Chromium | Firefox)[];
export declare function install(configOrPath: IInstallConfig | string, configOrPathEx?: IInstallConfig | string): Promise<(Chromium | Firefox)[]>;
export interface IInstallConfig {
    browsers: IInstallBrowsersConfig[];
}
export interface IInstallBrowsersConfig {
    name: string;
    version: string;
    platform: string;
    language?: string;
}
