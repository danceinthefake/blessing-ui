<script setup lang="ts">
import { ref } from "vue";
import { BlessFileTree, BlessText } from "blessing-ui";

// the project folder of one podcast episode
const paths = [
  "ep41/audio/raw-host.wav",
  "ep41/audio/raw-guest.wav",
  "ep41/audio/final.mp3",
  "ep41/art/cover.png",
  "ep41/art/cover-square.jpg",
  "ep41/video/clip-1.mp4",
  "ep41/notes.md",
  "ep41/chapters.json",
  "ep41/exports/",
  "README.md",
];
const selected = ref<string | undefined>("ep41/audio/final.mp3");
</script>

<template>
  <div style="max-width: 360px">
    <BlessFileTree v-model:selected="selected" :paths label="Episode files" />
    <BlessText as="p" size="sm" style="margin-top: 12px">Selected: {{ selected }}</BlessText>
  </div>
</template>
