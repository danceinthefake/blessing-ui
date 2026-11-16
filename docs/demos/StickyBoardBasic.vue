<script setup lang="ts">
import { ref } from "vue";
import { BlessStickyBoard, type BlessStickyNote } from "blessing-ui";

// ideas for the next season, from a planning call
const notes = ref<BlessStickyNote[]>([
  { id: "a", text: "Live episode with listeners", x: 24, y: 24, color: "yellow" },
  { id: "b", text: "Guest: the sound engineer of a radio station", x: 210, y: 40, color: "pink" },
  { id: "c", text: "Shorter intro, under 30 seconds", x: 60, y: 190, color: "blue" },
  { id: "d", text: "Ask listeners for their worst room", x: 260, y: 200, color: "green" },
]);
</script>

<template>
  <BlessStickyBoard v-model="notes" :height="380" />
</template>
