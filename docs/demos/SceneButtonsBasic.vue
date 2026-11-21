<template>
  <BlessSceneButtons v-model="active" :scenes style="max-width: 560px" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessSceneButtons, type BlessScene } from "blessing-ui";

const scenes: BlessScene[] = [
  { id: "rec", name: "Recording", icon: "🎙️", description: "On air sign on, AC off, phone silent" },
  { id: "edit", name: "Editing", icon: "🎧", description: "Desk lamp on, AC 23 °C" },
  { id: "away", name: "Away", icon: "🔒", description: "All lights off, door locked" },
  { id: "night", name: "Night", icon: "🌙", description: "Lights off, dehumidifier on" },
];
const active = ref("edit");
</script>
