<template>
  <BlessLessonPath :lessons @select="(id) => (opened = id)" />
  <BlessText v-if="opened" as="p" size="sm" style="margin-top: 12px"
    >Opened: {{ opened }}</BlessText
  >
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessLessonPath, BlessText, type BlessLesson } from "blessing-ui";

// a short course: record your first episode at home
const lessons = ref<BlessLesson[]>([
  { id: "room", title: "Pick your room", meta: "5 min", done: true },
  { id: "mic", title: "Set up the microphone", meta: "8 min", done: true },
  { id: "gain", title: "Set the gain", meta: "6 min" },
  { id: "take", title: "Record your first take", meta: "12 min" },
  { id: "edit", title: "Cut the mistakes", meta: "10 min" },
  { id: "publish", title: "Publish the episode", meta: "7 min" },
]);
const opened = ref<string>();
</script>
