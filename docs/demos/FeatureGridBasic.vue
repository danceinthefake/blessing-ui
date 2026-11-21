<template>
  <BlessFeatureGrid :features>
    <template #icon="{ index }">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="icons[index]" />
      </svg>
    </template>
  </BlessFeatureGrid>
</template>

<script setup lang="ts">
import { BlessFeatureGrid, type BlessFeature } from "blessing-ui";

const features: BlessFeature[] = [
  {
    title: "Record in the browser",
    text: "Plug in a USB mic and press record. Nothing to install.",
  },
  {
    title: "Clean up the noise",
    text: "One click takes out fans, traffic, and hum, and keeps the voice.",
  },
  { title: "Edit by text", text: "Delete a word in the transcript, and the audio follows." },
  {
    title: "Share a draft",
    text: "Send a link to your guest. They comment at the second they mean.",
  },
  { title: "Publish everywhere", text: "One upload goes to all the podcast apps at once." },
  {
    title: "Know your listeners",
    text: "See where people stop listening, without any tracking scripts.",
  },
];
// one simple line icon for each feature, in the same order
const icons = [
  "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
  "M3 12h3l3-8 6 16 3-8h3",
  "M4 6h16M4 12h10M4 18h7",
  "M15 8a3 3 0 1 0 0-.1M6 15a3 3 0 1 0 0-.1M18 21a3 3 0 1 0 0-.1M8.5 13.5l7-4M8.5 16.5l7 4",
  "M12 3v12M7 8l5-5 5 5M4 17v4h16v-4",
  "M4 20V10M10 20V4M16 20v-7M22 20H2",
];
</script>
