/** Circular buffer for audio sample processing. */
export class CircularBuffer {
    private readonly buffer: Float32Array
    private readonly length: number
    private inputIndex = 0
    private processedIndex = 0
    private outputIndex = 0

    constructor(length: number) {
        this.length = length
        this.buffer = new Float32Array(length)
    }

    /** Samples available for processing. */
    get availableForProcessing(): number {
        return this.inputIndex - this.processedIndex
    }

    /** Samples available for output. */
    get availableForOutput(): number {
        return this.processedIndex - this.outputIndex
    }

    /** Write samples to buffer. */
    write(samples: Float32Array): void {
        for (let i = 0; i < samples.length; i++) {
            this.buffer[(this.inputIndex + i) % this.length] = samples[i]!
        }
        this.inputIndex += samples.length
    }

    /** Get view for in-place processing. Returns null if insufficient data or would wrap. */
    getProcessingView(count: number): Float32Array | null {
        if (this.availableForProcessing < count) return null
        const start = this.processedIndex % this.length
        if (start + count > this.length) return null
        this.processedIndex += count
        return this.buffer.subarray(start, start + count)
    }

    /** Read processed samples to output. Returns false if insufficient data. */
    readForOutput(output: Float32Array): boolean {
        if (this.availableForOutput < output.length) return false
        for (let i = 0; i < output.length; i++) {
            output[i] = this.buffer[(this.outputIndex + i) % this.length]!
        }
        this.outputIndex += output.length
        return true
    }
}
