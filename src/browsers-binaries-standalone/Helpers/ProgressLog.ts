import {_, Chalk} from "../externals";

export class ProgressLog {
    private chunksLength: number = 10;
    private total: number = 0;
    private current: number = 0;
    private chunks: { [chunk: number]: boolean } = {};

    public init(total: number) {
        this.total = total;
    }

    public progress(add: number) {
        this.current += add;
        if(!this.total) {
            return;
        }

        let chunkProgress = Math.ceil(this.current / this.total * this.chunksLength);
        if(this.chunks[chunkProgress]) {
            return;
        }

        this.chunks[chunkProgress] = true;
        let percentage = Math.round(chunkProgress / this.chunksLength * 100);
        console.log(Chalk.yellow(percentage + "%"));
    }
}