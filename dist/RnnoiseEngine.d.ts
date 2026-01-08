import type { RnnoiseWasmModule } from "./types";
export declare class RnnoiseError extends Error {
    name: string;
}
/** Low-level RNNoise WASM wrapper. Handles memory and format conversion. */
export declare class RnnoiseEngine {
    private readonly wasm;
    private readonly context;
    private readonly bufferPtr;
    private readonly heapOffset;
    private destroyed;
    static readonly SAMPLE_LENGTH = 480;
    static readonly SAMPLE_RATE = 48000;
    constructor(wasm: RnnoiseWasmModule);
    /** Process 480 samples. Returns VAD score 0-1. Writes denoised audio back if denoise=true. */
    process(frame: Float32Array, denoise?: boolean): number;
    /** Free WASM resources. */
    destroy(): void;
}
//# sourceMappingURL=RnnoiseEngine.d.ts.map