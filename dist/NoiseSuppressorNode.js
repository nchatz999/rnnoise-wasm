import { NOISE_SUPPRESSOR_WORKLET_NAME } from "./constants";
/** AudioWorkletNode wrapper for noise suppression. */
export class NoiseSuppressorNode extends AudioWorkletNode {
    _enabled = true;
    constructor(context) {
        super(context, NOISE_SUPPRESSOR_WORKLET_NAME);
    }
    /** Enable or disable noise suppression. */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        this.port.postMessage({ type: "setEnabled", enabled: value });
    }
}
//# sourceMappingURL=NoiseSuppressorNode.js.map