export type VadCallback = (speaking: boolean) => void;
/** AudioWorkletNode wrapper for noise suppression. */
export declare class NoiseSuppressorNode extends AudioWorkletNode {
    private _enabled;
    private _vadCallback?;
    constructor(context: BaseAudioContext);
    /** Enable or disable noise suppression. */
    get enabled(): boolean;
    set enabled(value: boolean);
    /** Set VAD callback. Threshold 0-1, default 0.5. */
    setVad(callback: VadCallback, threshold?: number): void;
}
//# sourceMappingURL=NoiseSuppressorNode.d.ts.map