import { Track } from "livekit-client";
import { NoiseSuppressorNode } from "./NoiseSuppressorNode";
/** LiveKit-compatible audio processor for noise suppression. */
export class NoiseSuppressorProcessor {
    workletUrl;
    name = "rnnoise-suppressor";
    processedTrack;
    node;
    sourceNode;
    destinationNode;
    audioContext;
    constructor(workletUrl) {
        this.workletUrl = workletUrl;
    }
    async init(opts) {
        if (opts.kind !== Track.Kind.Audio) {
            throw new Error("NoiseSuppressorProcessor can only be applied to audio tracks");
        }
        if (!opts.audioContext) {
            throw new Error("NoiseSuppressorProcessor requires audioContext");
        }
        await opts.audioContext.audioWorklet.addModule(this.workletUrl);
        const stream = new MediaStream([opts.track]);
        this.sourceNode = opts.audioContext.createMediaStreamSource(stream);
        this.node = new NoiseSuppressorNode(opts.audioContext);
        this.destinationNode = opts.audioContext.createMediaStreamDestination();
        this.sourceNode.connect(this.node).connect(this.destinationNode);
        this.processedTrack = this.destinationNode.stream.getAudioTracks()[0];
    }
    async restart(opts) {
        if (opts.kind !== Track.Kind.Audio || !opts.audioContext) {
            throw new Error("NoiseSuppressorProcessor requires an audio track with audioContext");
        }
        await this.destroy();
        await this.init(opts);
    }
    /** Free audio resources. */
    async destroy() {
        this.sourceNode?.disconnect();
        this.node?.disconnect();
        this.destinationNode?.disconnect();
        await this.audioContext?.close();
        this.sourceNode = undefined;
        this.node = undefined;
        this.destinationNode = undefined;
        this.audioContext = undefined;
        this.processedTrack = undefined;
    }
    /** Enable or disable noise suppression. */
    set enabled(value) {
        if (this.node)
            this.node.enabled = value;
    }
    get enabled() {
        return this.node?.enabled ?? true;
    }
}
//# sourceMappingURL=NoiseSuppressorProcessor.js.map