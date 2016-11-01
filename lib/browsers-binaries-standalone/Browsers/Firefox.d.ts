import { BrowserBase, Platform } from "./Browsers";
export declare class Firefox extends BrowserBase {
    private language;
    constructor(platform: Platform, version: string, language?: string, path?: string);
    private getBinariesUrl();
    install(): Bluebird<void>;
    getExecutablePath(): string;
}
