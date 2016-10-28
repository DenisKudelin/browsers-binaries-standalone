import { Promise } from "../externals";
import { Platform } from "./Browsers";
export declare abstract class BrowserBase {
    version: string;
    platform: Platform;
    private name;
    constructor(name: string, platform: Platform, version: string);
    abstract getExecutablePath(): string;
    abstract install(): Promise<void>;
    getBinariesPath(path?: string): string;
    isDownloaded(): boolean;
    protected getExecutablePathByGlob(glob: string | string[]): string;
    protected installBase(install: () => Promise<void>): Promise<void>;
    protected downloadFile(url: string, unpack: (path: string) => Promise<any>): Promise<any>;
    protected unzipFile(path: string, clear: string[] | string): Promise<void>;
    protected getFullName(lowerCase?: boolean): string;
    protected log(message: string): void;
}
