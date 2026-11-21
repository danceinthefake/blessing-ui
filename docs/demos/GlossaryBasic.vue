<template>
  <p style="max-width: 560px; margin: 0; line-height: 1.8">
    Export the episode at
    <BlessGlossary
      term="LUFS"
      definition="Loudness Units relative to Full Scale: how loud a sound seems to the ear, measured over the whole file."
      >−16 LUFS</BlessGlossary
    >, and put a
    <BlessGlossary
      definition="A thin screen in front of the microphone. It stops the bursts of air from P and B sounds."
      >pop filter</BlessGlossary
    >
    in front of the microphone. If the room has a lot of
    <BlessGlossary
      definition="Sound that comes back from hard walls a moment later, so the voice sounds far away."
      >echo</BlessGlossary
    >, record next to a full wardrobe.
  </p>
</template>

<script setup lang="ts">
import { BlessGlossary } from "blessing-ui";
</script>
