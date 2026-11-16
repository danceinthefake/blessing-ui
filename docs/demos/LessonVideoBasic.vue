<script setup lang="ts">
import { ref } from "vue";
import { BlessLessonVideo, type BlessVideoNote } from "blessing-ui";

// the video is a CC0 clip from MDN
const notes = ref<BlessVideoNote[]>([
  { id: "1", at: 1, text: "Soft light from the left: no hard shadows." },
  { id: "2", at: 4, text: "Slow push in. Try this for the product shot." },
]);
</script>

<template>
  <BlessLessonVideo
    v-model="notes"
    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    title="Lesson 3: light and movement"
  />
</template>
