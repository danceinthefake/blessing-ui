<script setup lang="ts">
import { ref } from "vue";
import { BlessCallScreen, type BlessCallPerson } from "blessing-ui";
import { art } from "./_data";

// a planning call; in a real app the video slot holds a <video> with the stream of each person
const people: BlessCallPerson[] = [
  { id: "ana", name: "Ana Putri", speaking: true },
  { id: "budi", name: "Budi Santoso", muted: true },
  { id: "citra", name: "Citra Dewi", cameraOff: true },
  { id: "dimas", name: "Dimas", muted: true, cameraOff: true },
];
const frames: Record<string, string> = {
  ana: art("👩🏻", "3b3f4a"),
  budi: art("👨🏽", "41463b"),
};
const muted = ref(false);
const camera = ref(true);
const sharing = ref(false);
const left = ref(false);
</script>

<template>
  <p v-if="left">You left the call.</p>
  <BlessCallScreen
    v-else
    v-model:muted="muted"
    v-model:camera="camera"
    v-model:sharing="sharing"
    :people
    elapsed="12:04"
    @leave="left = true"
  >
    <template #video="{ person }">
      <img v-if="frames[person.id]" :src="frames[person.id]" alt="" />
    </template>
  </BlessCallScreen>
</template>
