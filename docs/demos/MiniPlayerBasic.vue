<template>
  <BlessMiniPlayer
    v-model:playing="playing"
    v-model:position="position"
    title="Episode 41: the final edit"
    artist="Home Studio"
    :image="art('🎙️', 'f3e1e7')"
    :duration="2640"
    style="max-width: 560px"
    @previous="said = 'Previous'"
    @next="said = 'Next'"
    @open="said = 'Open the full player'"
  />
  <p v-if="said" style="margin-top: 12px">{{ said }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessMiniPlayer } from "blessing-ui";
import { art } from "./_data";

// the app drives a real <audio> element and passes its time here
const playing = ref(false);
const position = ref(754);
const said = ref("");
</script>
