/** RNNoise frame size (fixed at 480 samples). */
export const RNNOISE_SAMPLE_LENGTH = 480;
/** Buffer size in bytes (480 samples * 4 bytes). */
export const RNNOISE_BUFFER_SIZE = RNNOISE_SAMPLE_LENGTH * 4;
/** RNNoise sample rate (fixed at 48kHz). */
export const RNNOISE_SAMPLE_RATE = 48000;
/** Multiplier for float32 to int16 conversion. */
export const FLOAT32_TO_INT16 = 32768;
/** AudioWorklet block size (fixed at 128 samples). */
export const WORKLET_BLOCK_SIZE = 128;
/** AudioWorkletProcessor registration name. */
export const NOISE_SUPPRESSOR_WORKLET_NAME = "NoiseSuppressorWorklet";
//# sourceMappingURL=constants.js.map