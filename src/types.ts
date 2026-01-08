/** RNNoise WASM module interface. */
export interface RnnoiseWasmModule extends EmscriptenModule {
    /** Create denoising context. Pass 0 for default model. Returns pointer. */
    _rnnoise_create: (model: number) => number
    /** Destroy context and free resources. */
    _rnnoise_destroy: (context: number) => void
    /** Process frame. Returns VAD score 0-1. */
    _rnnoise_process_frame: (context: number, output: number, input: number) => number
}

/** Processing result. */
export interface ProcessFrameResult {
    /** VAD score 0-1. Higher = more likely speech. */
    vadScore: number
}

/** RNNoise configuration. */
export interface RnnoiseConfig {
    /** Frame size (always 480). */
    readonly sampleLength: number
    /** Sample rate (always 48000). */
    readonly pcmFrequency: number
}

/** Circular buffer state. */
export interface CircularBufferState {
    buffer: Float32Array
    length: number
    inputIndex: number
    denoisedIndex: number
    outputIndex: number
}
