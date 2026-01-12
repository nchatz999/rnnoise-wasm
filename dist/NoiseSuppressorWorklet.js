// Polyfill atob for AudioWorkletGlobalScope (required by Emscripten WASM loader)
import { atob, leastCommonMultiple } from "./utils";
globalThis.atob = atob;
import { RnnoiseEngine } from "./RnnoiseEngine";
import { CircularBuffer } from "./CircularBuffer";
import { RNNOISE_SAMPLE_LENGTH, NOISE_SUPPRESSOR_WORKLET_NAME, WORKLET_BLOCK_SIZE } from "./constants";
import createRNNWasmModuleSync from "./generated/rnnoise-sync";
/** AudioWorklet processor for real-time noise suppression. */
class NoiseSuppressorWorklet extends AudioWorkletProcessor {
    engine;
    buffer;
    enabled = true;
    vadThreshold = 0;
    speaking = false;
    lastVadTime = 0;
    constructor() {
        super();
        const wasm = createRNNWasmModuleSync();
        this.engine = new RnnoiseEngine(wasm);
        this.buffer = new CircularBuffer(leastCommonMultiple(WORKLET_BLOCK_SIZE, RNNOISE_SAMPLE_LENGTH));
        this.port.onmessage = (e) => {
            if (e.data.type === "setEnabled")
                this.enabled = e.data.enabled;
            else if (e.data.type === "setVad")
                this.vadThreshold = e.data.threshold;
        };
    }
    process(inputs, outputs) {
        const input = inputs[0]?.[0];
        const output = outputs[0]?.[0];
        if (!input || !output)
            return true;
        if (!this.enabled) {
            output.set(input);
            return true;
        }
        this.buffer.write(input);
        let vad = 0;
        let frames = 0;
        let frame = this.buffer.getProcessingView(RNNOISE_SAMPLE_LENGTH);
        while (frame) {
            vad += this.engine.process(frame);
            frames++;
            frame = this.buffer.getProcessingView(RNNOISE_SAMPLE_LENGTH);
        }
        if (this.vadThreshold > 0 && frames > 0) {
            const speaking = vad / frames >= this.vadThreshold;
            const now = currentTime * 1000;
            if (speaking !== this.speaking && now - this.lastVadTime > 100) {
                this.speaking = speaking;
                this.lastVadTime = now;
                this.port.postMessage({ type: "vad", speaking });
            }
        }
        this.buffer.readForOutput(output);
        return true;
    }
}
registerProcessor(NOISE_SUPPRESSOR_WORKLET_NAME, NoiseSuppressorWorklet);
//# sourceMappingURL=NoiseSuppressorWorklet.js.map