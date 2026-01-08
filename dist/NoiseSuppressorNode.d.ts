/** AudioWorkletNode wrapper for noise suppression. */
export declare class NoiseSuppressorNode extends AudioWorkletNode {
    private _enabled;
    constructor(context: BaseAudioContext);
    /** Enable or disable noise suppression. */
    get enabled(): boolean;
    set enabled(value: boolean);
}
//# sourceMappingURL=NoiseSuppressorNode.d.ts.map