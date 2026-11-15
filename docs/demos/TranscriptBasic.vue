<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { BlessButton, BlessTranscript } from "blessing-ui";

// a stand-in for an audio element: a clock that runs while "playing"
const time = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
function play() {
  playing.value = !playing.value;
  clearInterval(timer);
  if (playing.value) timer = setInterval(() => (time.value = (time.value + 0.25) % 60), 250);
}
onBeforeUnmount(() => clearInterval(timer));

const cues = [
  { start: 0, text: "Welcome back to Home Studio, episode forty-one.", speaker: "Ana" },
  { start: 5, text: "Today we talk about sound on a small budget.", speaker: "Ana" },
  { start: 10, text: "With me is Budi, who records a show from his bedroom.", speaker: "Ana" },
  { start: 16, text: "Thanks for having me. It is a very small bedroom.", speaker: "Budi" },
  { start: 22, text: "So what did you buy first?", speaker: "Ana" },
  { start: 26, text: "Nothing! I moved my desk next to the wardrobe.", speaker: "Budi" },
  { start: 32, text: "The clothes stop the echo better than foam panels.", speaker: "Budi" },
  { start: 39, text: "That is the cheapest tip of the year.", speaker: "Ana" },
  { start: 44, text: "Then a USB microphone, and a pop filter from a sock.", speaker: "Budi" },
  { start: 52, text: "We will put the links in the show notes.", speaker: "Ana" },
];
</script>

<template>
  <div style="max-width: 560px">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
      <BlessButton size="sm" @click="play">{{ playing ? "Pause" : "Play" }}</BlessButton>
      <span style="font-variant-numeric: tabular-nums"
        >0:{{ String(Math.floor(time)).padStart(2, "0") }}</span
      >
    </div>
    <BlessTranscript
      :cues
      :time
      style="--bless-transcript-height: 14rem"
      @seek="(s) => (time = s)"
    />
  </div>
</template>
