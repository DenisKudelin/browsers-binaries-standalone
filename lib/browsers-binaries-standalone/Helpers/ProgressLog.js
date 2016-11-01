"use strict";
var externals_1 = require("../externals");
var ProgressLog = (function () {
    function ProgressLog() {
        this.chunksLength = 10;
        this.total = 0;
        this.current = 0;
        this.chunks = {};
    }
    ProgressLog.prototype.init = function (total) {
        this.total = total;
    };
    ProgressLog.prototype.progress = function (add) {
        this.current += add;
        if (!this.total) {
            return;
        }
        var chunkProgress = Math.ceil(this.current / this.total * this.chunksLength);
        if (this.chunks[chunkProgress]) {
            return;
        }
        this.chunks[chunkProgress] = true;
        var percentage = Math.round(chunkProgress / this.chunksLength * 100);
        console.log(externals_1.Chalk.yellow(percentage + "%"));
    };
    return ProgressLog;
}());
exports.ProgressLog = ProgressLog;
