<script setup lang="ts">
import { ref } from "vue";
import { BlessEpisodeList, type BlessEpisode } from "blessing-ui";
import { art } from "./_data";

const episodes: BlessEpisode[] = [
  {
    id: "e1",
    number: 1,
    title: "The room is the instrument",
    minutes: 38,
    progress: 1,
    image: art("🏠", "f3e1e7"),
    summary: "Why a wardrobe beats foam, and how to hear the echo of your room.",
  },
  {
    id: "e2",
    number: 2,
    title: "Pick a microphone",
    minutes: 44,
    progress: 0.35,
    image: art("🎙️", "dfe8f3"),
    summary: "Dynamic or condenser, USB or XLR. We test five under 1 million rupiah.",
  },
  {
    id: "e3",
    number: 3,
    title: "Gain, once and for all",
    minutes: 31,
    image: art("🎚️", "e8f3df"),
    summary: "Set the level so you never clip and never hiss.",
  },
  {
    id: "e4",
    number: 4,
    title: "Edit an hour in twenty minutes",
    minutes: 52,
    image: art("✂️", "efe6d8"),
    summary: "Shortcuts, markers, and the one cut that saves the most time.",
  },
];
const playing = ref("e2");
</script>

<template>
  <BlessEpisodeList
    :episodes
    :current="playing"
    style="max-width: 640px"
    @play="(id) => (playing = id)"
  />
</template>
