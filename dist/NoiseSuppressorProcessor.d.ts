import type { ProcessorOptions, TrackProcessor } from "livekit-client";
import { Track } from "livekit-client";
import { VadCallback } from "./NoiseSuppressorNode";
/** LiveKit-compatible audio processor for noise suppression. */
export declare class NoiseSuppressorProcessor implements TrackProcessor<Track.Kind, ProcessorOptions<Track.Kind>> {
    private workletUrl;
    name: string;
    processedTrack?: MediaStreamTrack;
    private node?;
    private sourceNode?;
    private destinationNode?;
    private audioContext?;
    private _enabled;
    private _power;
    private _vadCallback?;
    private _vadThreshold;
    constructor(workletUrl: string);
    init(opts: ProcessorOptions<Track.Kind>): Promise<void>;
    restart(opts: ProcessorOptions<Track.Kind>): Promise<void>;
    /** Free audio resources. */
    destroy(): Promise<void>;
    /** Enable or disable noise suppression. */
    set enabled(value: boolean);
    get enabled(): boolean;
    /** Suppression power 0-100. 100 = full suppression, 0 = no suppression. */
    set power(value: number);
    get power(): number;
    /** Set VAD callback. Threshold 0-1, default 0.5. */
    setVad(callback: VadCallback, threshold?: number): void;
}
//# sourceMappingURL=NoiseSuppressorProcessor.d.ts.map