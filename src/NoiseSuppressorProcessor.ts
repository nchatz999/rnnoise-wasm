import type { ProcessorOptions, TrackProcessor } from "livekit-client"
import { Track } from "livekit-client"
import { NoiseSuppressorNode, VadCallback } from "./NoiseSuppressorNode"

/** LiveKit-compatible audio processor for noise suppression. */
export class NoiseSuppressorProcessor
  implements TrackProcessor<Track.Kind, ProcessorOptions<Track.Kind>> {
  name = "rnnoise-suppressor"

  processedTrack?: MediaStreamTrack
  private node?: NoiseSuppressorNode
  private sourceNode?: MediaStreamAudioSourceNode
  private destinationNode?: MediaStreamAudioDestinationNode
  private audioContext?: AudioContext

  private _enabled = true
  private _power = 75
  private _vadCallback?: VadCallback
  private _vadThreshold = 0.5

  constructor(private workletUrl: string) { }

  async init(opts: ProcessorOptions<Track.Kind>): Promise<void> {
    if (opts.kind !== Track.Kind.Audio) {
      throw new Error("NoiseSuppressorProcessor can only be applied to audio tracks")
    }
    if (!opts.audioContext) {
      throw new Error("NoiseSuppressorProcessor requires audioContext")
    }
    this.audioContext = opts.audioContext
    await opts.audioContext.audioWorklet.addModule(this.workletUrl)

    const stream = new MediaStream([opts.track])
    this.sourceNode = opts.audioContext.createMediaStreamSource(stream)
    this.node = new NoiseSuppressorNode(opts.audioContext)
    this.destinationNode = opts.audioContext.createMediaStreamDestination()
    this.destinationNode.channelCount = 1

    this.sourceNode.connect(this.node).connect(this.destinationNode)
    this.processedTrack = this.destinationNode.stream.getAudioTracks()[0]
  }

  async restart(opts: ProcessorOptions<Track.Kind>): Promise<void> {
    if (opts.kind !== Track.Kind.Audio) {
      throw new Error(
        "NoiseSuppressorProcessor requires an audio track",
      )
    }
    await this.destroy()
    await this.init({ ...opts, audioContext: opts.audioContext ?? this.audioContext })
    if (this.node) {
      this.node.enabled = this._enabled
      this.node.power = this._power
      if (this._vadCallback) {
        this.node.setVad(this._vadCallback, this._vadThreshold)
      }
    }
  }

  /** Free audio resources. */
  async destroy(): Promise<void> {
    this.sourceNode?.disconnect()
    this.node?.disconnect()
    this.destinationNode?.disconnect()

    this.sourceNode = undefined
    this.node = undefined
    this.destinationNode = undefined
    this.processedTrack = undefined
  }

  /** Enable or disable noise suppression. */
  set enabled(value: boolean) {
    this._enabled = value
    if (this.node) this.node.enabled = value
  }

  get enabled(): boolean {
    return this._enabled
  }

  /** Suppression power 0-100. 100 = full suppression, 0 = no suppression. */
  set power(value: number) {
    this._power = value
    if (this.node) this.node.power = value
  }

  get power(): number {
    return this._power
  }

  /** Set VAD callback. Threshold 0-1, default 0.5. */
  setVad(callback: VadCallback, threshold = 0.5): void {
    this._vadCallback = callback
    this._vadThreshold = threshold
    if (this.node) this.node.setVad(callback, threshold)
  }
}
