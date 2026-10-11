/** Cuts a list of peaks (0 to 1) to `n` bars, keeping the loudest value in each slice. */
export function downsample(peaks: number[], n: number): number[] {
  if (n <= 0 || !peaks.length) return [];
  if (peaks.length <= n) return peaks.map(clamp);
  return Array.from({ length: n }, (_, i) => {
    const from = Math.floor((i * peaks.length) / n);
    const to = Math.max(from + 1, Math.floor(((i + 1) * peaks.length) / n));
    return Math.max(...peaks.slice(from, to).map(clamp));
  });
}

const clamp = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, Math.abs(v))) : 0);

/** The loudest sample in each of `n` slices of the first channel, scaled so the biggest is 1. */
export function peaksFromChannel(data: Float32Array, n: number): number[] {
  if (!data.length || n <= 0) return [];
  const size = Math.max(1, Math.floor(data.length / n));
  const raw = Array.from({ length: n }, (_, i) => {
    let m = 0;
    const end = Math.min(data.length, (i + 1) * size);
    for (let k = i * size; k < end; k++) m = Math.max(m, Math.abs(data[k]));
    return m;
  });
  const top = Math.max(...raw) || 1;
  return raw.map((v) => v / top);
}

/** Fetches and decodes an audio file into `n` peaks. Browser only; it throws when the file cannot be read. */
export async function loadPeaks(src: string, n: number): Promise<number[]> {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Could not load ${src}`);
  const ctx = new AudioContext();
  try {
    const buf = await ctx.decodeAudioData(await res.arrayBuffer());
    return peaksFromChannel(buf.getChannelData(0), n);
  } finally {
    void ctx.close();
  }
}
