<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { BlessButton, BlessChapterList } from "blessing-ui";

// a stand-in for an audio element: a clock that runs ten times faster than real time
const time = ref(400);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
function play() {
  playing.value = !playing.value;
  clearInterval(timer);
  if (playing.value) timer = setInterval(() => (time.value = (time.value + 2.5) % 2820), 250);
}
onBeforeUnmount(() => clearInterval(timer));

const chapters = [
  { start: 0, title: "Welcome and news" },
  { start: 185, title: "Guest: Budi and his bedroom studio" },
  { start: 720, title: "Why the room matters more than the gear" },
  { start: 1390, title: "A first microphone under $100" },
  { start: 2050, title: "Editing and loudness" },
  { start: 2580, title: "Listener questions" },
];
</script>

<template>
  <div style="max-width: 560px">
    <BlessButton size="sm" style="margin-bottom: 12px" @click="play">
      {{ playing ? "Pause" : "Play" }}
    </BlessButton>
    <BlessChapterList :chapters :time :duration="2820" @seek="(s) => (time = s)" />
  </div>
</template>
