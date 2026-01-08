import { build } from "esbuild"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
    entryPoints: [join(__dirname, "../src/NoiseSuppressorWorklet.ts")],
    bundle: true,
    format: "esm",
    outfile: join(__dirname, "../dist/worklet-bundle.js"),
    tsconfig: join(__dirname, "../tsconfig.json"),
})

console.log("Worklet bundle built")