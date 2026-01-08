import type { ProcessorOptions, TrackProcessor } from "livekit-client";
import { Track } from "livekit-client";
/** LiveKit-compatible audio processor for noise suppression. */
export declare class NoiseSuppressorProcessor implements TrackProcessor<Track.Kind, ProcessorOptions<Track.Kind>> {
    private workletUrl;
    name: string;
    processedTrack?: MediaStreamTrack;
    private node?;
    private sourceNode?;
    private destinationNode?;
    private audioContext?;
    constructor(workletUrl: string);
    init(opts: ProcessorOptions<Track.Kind>): Promise<void>;
    restart(opts: ProcessorOptions<Track.Kind>): Promise<void>;
    /** Free audio resources. */
    destroy(): Promise<void>;
    /** Enable or disable noise suppression. */
    set enabled(value: boolean);
    get enabled(): boolean;
}
//# sourceMappingURL=NoiseSuppressorProcessor.d.ts.map