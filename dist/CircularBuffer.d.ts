/** Circular buffer for audio sample processing. */
export declare class CircularBuffer {
    private readonly buffer;
    private readonly length;
    private inputIndex;
    private processedIndex;
    private outputIndex;
    constructor(length: number);
    /** Samples available for processing. */
    get availableForProcessing(): number;
    /** Samples available for output. */
    get availableForOutput(): number;
    /** Write samples to buffer. */
    write(samples: Float32Array): void;
    /** Get view for in-place processing. Returns null if insufficient data or would wrap. */
    getProcessingView(count: number): Float32Array | null;
    /** Read processed samples to output. Returns false if insufficient data. */
    readForOutput(output: Float32Array): boolean;
}
//# sourceMappingURL=CircularBuffer.d.ts.map