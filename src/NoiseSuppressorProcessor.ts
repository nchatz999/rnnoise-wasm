import type { ProcessorOptions, TrackProcessor } from "livekit-client"
import { Track } from "livekit-client"
import { NoiseSuppressorNode } from "./NoiseSuppressorNode"

/** LiveKit-compatible audio processor for noise suppression. */
export class NoiseSuppressorProcessor
  implements TrackProcessor<Track.Kind, ProcessorOptions<Track.Kind>> {
  name = "rnnoise-suppressor"

  processedTrack?: MediaStreamTrack
  private node?: NoiseSuppressorNode
  private sourceNode?: MediaStreamAudioSourceNode
  private destinationNode?: MediaStreamAudioDestinationNode
  private audioContext?: AudioContext

  constructor(private workletUrl: string) { }

  async init(opts: ProcessorOptions<Track.Kind>): Promise<void> {
    if (opts.kind !== Track.Kind.Audio) {
      throw new Error("NoiseSuppressorProcessor can only be applied to audio tracks")
    }
    if (!opts.audioContext) {
      throw new Error("NoiseSuppressorProcessor requires audioContext")
    }
    await opts.audioContext.audioWorklet.addModule(this.workletUrl)

    const stream = new MediaStream([opts.track])
    this.sourceNode = opts.audioContext.createMediaStreamSource(stream)
    this.node = new NoiseSuppressorNode(opts.audioContext)
    this.destinationNode = opts.audioContext.createMediaStreamDestination()

    this.sourceNode.connect(this.node).connect(this.destinationNode)
    this.processedTrack = this.destinationNode.stream.getAudioTracks()[0]
  }

  async restart(opts: ProcessorOptions<Track.Kind>): Promise<void> {
    if (opts.kind !== Track.Kind.Audio || !opts.audioContext) {
      throw new Error(
        "NoiseSuppressorProcessor requires an audio track with audioContext",
      )
    }
    await this.destroy()
    await this.init(opts)
  }

  /** Free audio resources. */
  async destroy(): Promise<void> {
    this.sourceNode?.disconnect()
    this.node?.disconnect()
    this.destinationNode?.disconnect()
    await this.audioContext?.close()

    this.sourceNode = undefined
    this.node = undefined
    this.destinationNode = undefined
    this.audioContext = undefined
    this.processedTrack = undefined
  }

  /** Enable or disable noise suppression. */
  set enabled(value: boolean) {
    if (this.node) this.node.enabled = value
  }

  get enabled(): boolean {
    return this.node?.enabled ?? true
  }
}
