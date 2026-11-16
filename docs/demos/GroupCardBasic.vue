<script setup lang="ts">
import { ref } from "vue";
import { BlessGroupCard, type BlessGroupState } from "blessing-ui";
import { art } from "./_data";

const faces = [
  { name: "Ana Putri" },
  { name: "Budi Santoso" },
  { name: "Citra Dewi" },
  { name: "Dimas" },
  { name: "Eka" },
];
const recorders = ref<BlessGroupState>("none");
const editors = ref<BlessGroupState>("none");
</script>

<template>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px"
  >
    <BlessGroupCard
      v-model="recorders"
      name="Home recording, Indonesia"
      href="#home-recording"
      :cover="art('🎙️', 'f3e1e7')"
      description="Tips for rooms, mics, and editing. Share your setup and ask for help."
      :members="12480"
      :faces
    />
    <BlessGroupCard
      v-model="editors"
      name="Podcast editors"
      href="#editors"
      :cover="art('✂️', 'e8f3df')"
      description="A closed room for people who edit shows for a living."
      :members="842"
      :faces="faces.slice(0, 2)"
      private
    />
  </div>
</template>
