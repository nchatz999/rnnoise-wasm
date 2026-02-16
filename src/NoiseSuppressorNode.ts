import { NOISE_SUPPRESSOR_WORKLET_NAME } from "./constants"

export type VadCallback = (speaking: boolean) => void

/** AudioWorkletNode wrapper for noise suppression. */
export class NoiseSuppressorNode extends AudioWorkletNode {
    private _enabled = true
    private _vadCallback?: VadCallback

    constructor(context: BaseAudioContext) {
        super(context, NOISE_SUPPRESSOR_WORKLET_NAME)
        this.port.onmessage = (e) => {
            if (e.data.type === "vad" && this._vadCallback) this._vadCallback(e.data.speaking)
        }
    }

    /** Enable or disable noise suppression. */
    get enabled(): boolean {
        return this._enabled
    }

    set enabled(value: boolean) {
        this._enabled = value
        this.port.postMessage({ type: "setEnabled", enabled: value })
    }

    /** Set VAD callback. Threshold 0-1, default 0.5. */
    setVad(callback: VadCallback, threshold = 0.5): void {
        this._vadCallback = callback
        this.port.postMessage({ type: "setVad", threshold: threshold })
    }
}
