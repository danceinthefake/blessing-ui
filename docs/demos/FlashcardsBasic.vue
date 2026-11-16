<script setup lang="ts">
import { BlessFlashcards } from "blessing-ui";

// words of home recording, for a new member of the team
const cards = [
  { front: "Gain", back: "How much the microphone input is made louder, before you record." },
  { front: "LUFS", back: "A unit of loudness. Podcast apps play episodes at about −16 LUFS." },
  { front: "Pop filter", back: "A screen in front of the microphone that stops bursts of air." },
  { front: "Room tone", back: "A few seconds of the quiet room, to fill gaps in the edit." },
];
</script>

<template>
  <BlessFlashcards :cards />
</template>
