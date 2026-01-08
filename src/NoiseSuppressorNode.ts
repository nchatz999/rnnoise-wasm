import { NOISE_SUPPRESSOR_WORKLET_NAME } from "./constants"

/** AudioWorkletNode wrapper for noise suppression. */
export class NoiseSuppressorNode extends AudioWorkletNode {
    private _enabled = true

    constructor(context: BaseAudioContext) {
        super(context, NOISE_SUPPRESSOR_WORKLET_NAME)
    }

    /** Enable or disable noise suppression. */
    get enabled(): boolean {
        return this._enabled
    }

    set enabled(value: boolean) {
        this._enabled = value
        this.port.postMessage({ type: "setEnabled", enabled: value })
    }
}
