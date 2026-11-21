<template>
  <BlessAchievements :achievements />
</template>

<script setup lang="ts">
import { BlessAchievements, type BlessAchievement } from "blessing-ui";

// the badges of a podcast maker after a month of work
const achievements: BlessAchievement[] = [
  {
    id: "first",
    icon: "🎙️",
    title: "First take",
    description: "Record your first episode",
    earned: "2 Nov",
  },
  {
    id: "quiet",
    icon: "🤫",
    title: "Quiet room",
    description: "Record with no noise above −60 dB",
    earned: "9 Nov",
  },
  {
    id: "guest",
    icon: "🤝",
    title: "First guest",
    description: "Talk with a guest on the show",
    earned: "14 Nov",
  },
  {
    id: "ten",
    icon: "🏆",
    title: "Ten episodes",
    description: "Publish ten episodes",
    progress: [6, 10],
  },
  {
    id: "week",
    icon: "📅",
    title: "Every week",
    description: "Publish eight weeks in a row",
    progress: [3, 8],
  },
  { id: "owl", icon: "🦉", title: "Night owl", description: "Publish an episode after midnight" },
];
</script>
