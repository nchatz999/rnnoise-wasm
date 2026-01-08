import { RNNOISE_SAMPLE_LENGTH, RNNOISE_BUFFER_SIZE, RNNOISE_SAMPLE_RATE, FLOAT32_TO_INT16, } from "./constants";
export class RnnoiseError extends Error {
    name = "RnnoiseError";
}
/** Low-level RNNoise WASM wrapper. Handles memory and format conversion. */
export class RnnoiseEngine {
    wasm;
    context;
    bufferPtr;
    heapOffset;
    destroyed = false;
    static SAMPLE_LENGTH = RNNOISE_SAMPLE_LENGTH;
    static SAMPLE_RATE = RNNOISE_SAMPLE_RATE;
    constructor(wasm) {
        this.wasm = wasm;
        this.bufferPtr = wasm._malloc(RNNOISE_BUFFER_SIZE);
        if (!this.bufferPtr)
            throw new RnnoiseError("Failed to allocate WASM memory");
        this.heapOffset = this.bufferPtr >> 2;
        this.context = wasm._rnnoise_create(0);
        if (!this.context) {
            wasm._free(this.bufferPtr);
            throw new RnnoiseError("Failed to create RNNoise context");
        }
    }
    /** Process 480 samples. Returns VAD score 0-1. Writes denoised audio back if denoise=true. */
    process(frame, denoise = true) {
        if (this.destroyed)
            throw new RnnoiseError("Engine is destroyed");
        if (frame.length !== RNNOISE_SAMPLE_LENGTH) {
            throw new RnnoiseError(`Expected ${RNNOISE_SAMPLE_LENGTH} samples, got ${frame.length}`);
        }
        const heap = this.wasm.HEAPF32;
        for (let i = 0; i < RNNOISE_SAMPLE_LENGTH; i++) {
            heap[this.heapOffset + i] = frame[i] * FLOAT32_TO_INT16;
        }
        const vad = this.wasm._rnnoise_process_frame(this.context, this.bufferPtr, this.bufferPtr);
        if (denoise) {
            for (let i = 0; i < RNNOISE_SAMPLE_LENGTH; i++) {
                frame[i] = heap[this.heapOffset + i] / FLOAT32_TO_INT16;
            }
        }
        return vad;
    }
    /** Free WASM resources. */
    destroy() {
        if (this.destroyed)
            return;
        this.wasm._free(this.bufferPtr);
        this.wasm._rnnoise_destroy(this.context);
        this.destroyed = true;
    }
}
//# sourceMappingURL=RnnoiseEngine.js.map