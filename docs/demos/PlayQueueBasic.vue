<template>
  <BlessPlayQueue v-model="queue" :current style="max-width: 440px" @play="play" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPlayQueue, type BlessQueueTrack } from "blessing-ui";
import { art } from "./_data";

const current = ref<BlessQueueTrack>({
  id: "e41",
  title: "Episode 41: the final edit",
  artist: "Home Studio",
  seconds: 2640,
  image: art("🎙️", "f3e1e7"),
});
const queue = ref<BlessQueueTrack[]>([
  {
    id: "e42",
    title: "Episode 42: a guest from the radio",
    artist: "Home Studio",
    seconds: 3125,
    image: art("📻", "dfe8f3"),
  },
  {
    id: "b1",
    title: "Bonus: room tone, explained",
    artist: "Home Studio",
    seconds: 540,
    image: art("🔇", "e8f3df"),
  },
  {
    id: "x1",
    title: "Mixing voices for beginners",
    artist: "Edit Night",
    seconds: 1880,
    image: art("🎚️", "efe6d8"),
  },
]);
function play(id: string) {
  const i = queue.value.findIndex((t) => t.id === id);
  if (i < 0) return;
  current.value = queue.value[i]!;
  queue.value = queue.value.slice(i + 1);
}
</script>
