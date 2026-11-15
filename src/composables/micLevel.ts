/**
 * Reads the loudness of a microphone stream once a frame, 0 to 1, and passes it to `onLevel`.
 * Returns a function that stops the reading and closes the audio context. Without Web Audio it does nothing.
 */
export function micLevel(stream: MediaStream, onLevel: (level: number) => void): () => void {
  if (typeof AudioContext === "undefined") return () => {};
  const ctx = new AudioContext();
  const an = ctx.createAnalyser();
  an.fftSize = 512;
  ctx.createMediaStreamSource(stream).connect(an);
  const buf = new Uint8Array(an.fftSize);
  let frame = 0;
  const read = () => {
    an.getByteTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) sum += ((v - 128) / 128) ** 2;
    // speech is quiet next to full scale: ×3 makes a normal voice fill most of the meter
    onLevel(Math.min(1, Math.sqrt(sum / buf.length) * 3));
    frame = requestAnimationFrame(read);
  };
  frame = requestAnimationFrame(read);
  return () => {
    cancelAnimationFrame(frame);
    void ctx.close();
  };
}
