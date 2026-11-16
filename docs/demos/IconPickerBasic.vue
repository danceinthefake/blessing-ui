<script setup lang="ts">
import { ref } from "vue";
import { BlessIconPicker, BlessText } from "blessing-ui";

// simple line icons drawn for this example, on a 24 × 24 box
const icons = [
  {
    name: "microphone",
    path: ["M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z", "M5 11a7 7 0 0 0 14 0M12 18v3"],
    keywords: ["record", "audio", "voice"],
  },
  { name: "play", path: "M7 5v14l12-7Z", keywords: ["start", "audio"] },
  { name: "pause", path: "M8 5v14M16 5v14", keywords: ["stop"] },
  {
    name: "headphones",
    path: ["M4 15v-3a8 8 0 0 1 16 0v3", "M4 15h3v5H4zM17 15h3v5h-3z"],
    keywords: ["listen", "audio"],
  },
  {
    name: "heart",
    path: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z",
    keywords: ["like", "love"],
  },
  {
    name: "star",
    path: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z",
    keywords: ["favorite", "rating"],
  },
  {
    name: "bell",
    path: ["M6 16V11a6 6 0 0 1 12 0v5l2 2H4Z", "M10 20a2 2 0 0 0 4 0"],
    keywords: ["notice", "alert"],
  },
  {
    name: "calendar",
    path: ["M4 6h16v14H4Z", "M4 10h16M8 3v4M16 3v4"],
    keywords: ["date", "event"],
  },
  { name: "chat", path: "M4 5h16v11H9l-5 4Z", keywords: ["message", "comment"] },
  {
    name: "share",
    path: [
      "M8 12l8-5M8 12l8 5",
      "M6 12a2 2 0 1 0 0 .01M18 7a2 2 0 1 0 0 .01M18 17a2 2 0 1 0 0 .01",
    ],
  },
  { name: "download", path: ["M12 4v11M7 10l5 5 5-5", "M5 20h14"], keywords: ["save"] },
  {
    name: "search",
    path: ["M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z", "M15.5 15.5 20 20"],
    keywords: ["find"],
  },
];
const chosen = ref("microphone");
</script>

<template>
  <div style="max-width: 360px">
    <BlessIconPicker v-model="chosen" :icons stroke />
    <BlessText as="p" size="sm" style="margin-top: 8px">Chosen: {{ chosen }}</BlessText>
  </div>
</template>
