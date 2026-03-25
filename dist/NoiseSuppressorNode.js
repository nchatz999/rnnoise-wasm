import { NOISE_SUPPRESSOR_WORKLET_NAME } from "./constants";
/** AudioWorkletNode wrapper for noise suppression. */
export class NoiseSuppressorNode extends AudioWorkletNode {
    _enabled = true;
    _power = 75;
    _vadCallback;
    constructor(context) {
        super(context, NOISE_SUPPRESSOR_WORKLET_NAME);
        this.port.onmessage = (e) => {
            if (e.data.type === "vad" && this._vadCallback)
                this._vadCallback(e.data.speaking);
        };
    }
    /** Enable or disable noise suppression. */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        this.port.postMessage({ type: "setEnabled", enabled: value });
    }
    /** Suppression power 0-100. 100 = full suppression, 0 = no suppression. */
    get power() {
        return this._power;
    }
    set power(value) {
        this._power = Math.max(0, Math.min(100, value));
        this.port.postMessage({ type: "setPower", power: this._power / 100 });
    }
    /** Set VAD callback. Threshold 0-1, default 0.5. */
    setVad(callback, threshold = 0.5) {
        this._vadCallback = callback;
        this.port.postMessage({ type: "setVad", threshold: threshold });
    }
}
//# sourceMappingURL=NoiseSuppressorNode.js.map