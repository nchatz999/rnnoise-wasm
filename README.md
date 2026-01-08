# rnnoise-wasm

RNNoise v0.2 noise suppression as a WASM module for AudioWorklet.

Fork of [@timephy/rnnoise-wasm](https://github.com/timephy/rnnoise-wasm).

## Install

```bash
npm install rnnoise-wasm
```

## Usage

```js
import { NoiseSuppressorNode } from "rnnoise-wasm"
import workletUrl from "rnnoise-wasm/worklet-bundle?url"

// Setup
const ctx = new AudioContext({ sampleRate: 48000 })
await ctx.audioWorklet.addModule(workletUrl)

// Create node
const suppressor = new NoiseSuppressorNode(ctx)
source.connect(suppressor).connect(ctx.destination)

// Toggle noise suppression
suppressor.enabled = false  // bypass
suppressor.enabled = true   // denoise
```

**Webpack** (different import syntax):
```js
const workletUrl = new URL("rnnoise-wasm/worklet-bundle", import.meta.url)
```

## LiveKit

```js
import { NoiseSuppressorProcessor } from "rnnoise-wasm"
import workletUrl from "rnnoise-wasm/worklet-bundle?url"

const processor = new NoiseSuppressorProcessor(workletUrl)
await localAudioTrack.setProcessor(processor)

// Toggle
processor.enabled = false
```

## Build

Requires Docker and Node.js.

```bash
npm install
npm run build
```

## License

Apache-2.0
