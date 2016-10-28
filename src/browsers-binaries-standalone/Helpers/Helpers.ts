import {_, Path, Promise} from "../externals";

export module Helpers {
    export function autoFormatSize(size: number) {
        if (size > 1000000000) {
            return (size / 1000000000.0)
                .toPrecision(3) + " GB";
        } else if (size > 1000000) {
            return (size / 1000000.0)
                .toPrecision(3) + " MB";
        } else if (size > 1000) {
            return (size / 1000.0)
                .toPrecision(3) + " KB";
        } else {
            return size + " B"
        }
    }
}