<script setup lang="ts">
import { BlessWaffle } from "blessing-ui";

// the apps that listeners used for one episode
const apps = [
  { label: "Spotify", value: 6240 },
  { label: "Apple Podcasts", value: 2810 },
  { label: "YouTube", value: 1530 },
  { label: "Other apps", value: 620 },
];
</script>

<template>
  <BlessWaffle :data="apps" label="Listeners of episode 41 by app" />
</template>
