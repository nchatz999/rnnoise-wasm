// Polyfill atob for AudioWorkletGlobalScope (required by Emscripten WASM loader)
import { atob, leastCommonMultiple } from "./utils"
globalThis.atob = atob

import { RnnoiseEngine } from "./RnnoiseEngine"
import { CircularBuffer } from "./CircularBuffer"
import { RNNOISE_SAMPLE_LENGTH, NOISE_SUPPRESSOR_WORKLET_NAME, WORKLET_BLOCK_SIZE } from "./constants"
import type { RnnoiseWasmModule } from "./types"
import createRNNWasmModuleSync from "./generated/rnnoise-sync"

/** AudioWorklet processor for real-time noise suppression. */
class NoiseSuppressorWorklet extends AudioWorkletProcessor {
    private readonly engine: RnnoiseEngine
    private readonly buffer: CircularBuffer
    private enabled = true

    constructor() {
        super()
        const wasm = createRNNWasmModuleSync() as RnnoiseWasmModule
        this.engine = new RnnoiseEngine(wasm)
        this.buffer = new CircularBuffer(leastCommonMultiple(WORKLET_BLOCK_SIZE, RNNOISE_SAMPLE_LENGTH))
        this.port.onmessage = (e) => {
            if (e.data.type === "setEnabled") this.enabled = e.data.enabled
        }
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
        const input = inputs[0]?.[0]
        const output = outputs[0]?.[0]
        if (!input || !output) return true

        if (!this.enabled) {
            output.set(input)
            return true
        }

        this.buffer.write(input)

        let frame = this.buffer.getProcessingView(RNNOISE_SAMPLE_LENGTH)
        while (frame) {
            this.engine.process(frame)
            frame = this.buffer.getProcessingView(RNNOISE_SAMPLE_LENGTH)
        }

        this.buffer.readForOutput(output)
        return true
    }
}

registerProcessor(NOISE_SUPPRESSOR_WORKLET_NAME, NoiseSuppressorWorklet)
