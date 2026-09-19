<script setup lang="ts">
import { BlessAudioPlayer } from "blessing-ui";

// tiny generated WAV so the demo has no external audio
const beep = (hz: number) => {
  if (typeof window === "undefined") return "";
  const rate = 8000,
    len = rate * 2,
    buf = new ArrayBuffer(44 + len),
    v = new DataView(buf);
  const str = (o: number, s: string) =>
    [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + len, true);
  str(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  str(36, "data");
  v.setUint32(40, len, true);
  for (let i = 0; i < len; i++)
    v.setUint8(44 + i, 128 + Math.round(60 * Math.sin((2 * Math.PI * hz * i) / rate)));
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
};
const tracks = [
  { src: beep(440), title: "Sample 01 (440Hz)", artist: "Blessing" },
  { src: beep(660), title: "Sample 02 (660Hz)", artist: "Blessing" },
  { src: beep(880), title: "Sample 03 (880Hz)" },
];
</script>

<template>
  <BlessAudioPlayer :tracks style="max-width: 480px" />
</template>
