<template>
  <div style="max-width: 420px">
    <BlessLyrics :lines :position @seek="(t) => (position = t)" />
    <p style="margin-top: 12px">Position: {{ position }} s. Click a line to jump to it.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessLyrics } from "blessing-ui";

// the theme song of the show; the app passes the time of its <audio> element
const lines = [
  { time: 0, text: "Turn the lights down low" },
  { time: 6, text: "Close the wardrobe door" },
  { time: 12, text: "The room is quiet now" },
  { time: 18, text: "Just the hum and nothing more" },
  { time: 25, text: "Say it once, say it slow" },
  { time: 31, text: "Let the red light glow" },
  { time: 37, text: "We are on the air" },
  { time: 43, text: "And the world can hear you there" },
];
const position = ref(14);
</script>
