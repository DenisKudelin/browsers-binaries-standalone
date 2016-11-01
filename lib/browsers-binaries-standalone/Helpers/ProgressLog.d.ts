export declare class ProgressLog {
    private chunksLength;
    private total;
    private current;
    private chunks;
    init(total: number): void;
    progress(add: number): void;
}
