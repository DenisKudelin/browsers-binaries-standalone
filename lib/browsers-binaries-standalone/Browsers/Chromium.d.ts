import { Promise } from "../externals";
import { BrowserBase, Platform } from "./Browsers";
export declare class Chromium extends BrowserBase {
    constructor(platform: Platform, version: string, path?: string);
    static getVersionInformation(version: string): Promise<IVersionInformation>;
    private getBinariesPlatformPath();
    private getBinariesPositions(bucket);
    private getBinariesUrl(position);
    private getBinariesUrlByPosition(bucket, position);
    install(): Promise<void>;
    getExecutablePath(): string;
}
export interface IVersionInformation {
    chromium_version: string;
    skia_commit: string;
    chromium_base_position: number;
    v8_version: string;
    chromium_branch: string;
    v8_position: number;
    chromium_base_commit: string;
    chromium_commit: string;
}
