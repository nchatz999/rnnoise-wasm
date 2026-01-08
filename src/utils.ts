/** Decode base64 string. Polyfill for AudioWorkletGlobalScope. */
export function atob(input: string): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    const lookup = new Uint8Array(128)
    for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i

    let len = (input.length * 3) / 4
    if (input[input.length - 1] === "=") len--
    if (input[input.length - 2] === "=") len--

    const bytes = new Uint8Array(len)
    for (let i = 0, p = 0; i < input.length; i += 4) {
        const a = lookup[input.charCodeAt(i)]!
        const b = lookup[input.charCodeAt(i + 1)]!
        const c = lookup[input.charCodeAt(i + 2)]!
        const d = lookup[input.charCodeAt(i + 3)]!
        bytes[p++] = (a << 2) | (b >> 4)
        if (p < len) bytes[p++] = ((b & 15) << 4) | (c >> 2)
        if (p < len) bytes[p++] = ((c & 3) << 6) | d
    }

    let result = ""
    for (let i = 0; i < bytes.length; i++) result += String.fromCharCode(bytes[i]!)
    return result
}

/** Greatest common divisor (Euclidean algorithm). */
export function greatestCommonDivisor(a: number, b: number): number {
    while (a !== b) {
        if (a > b) a -= b
        else b -= a
    }
    return b
}

/** Least common multiple. */
export function leastCommonMultiple(a: number, b: number): number {
    return (a * b) / greatestCommonDivisor(a, b)
}
