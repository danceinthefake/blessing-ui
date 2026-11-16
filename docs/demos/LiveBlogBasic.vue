<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessLiveBlog, type BlessLiveUpdate } from "blessing-ui";

const updates = ref<BlessLiveUpdate[]>([
  {
    id: "3",
    time: "19:40",
    body: "Budi swaps the dynamic mic for a condenser. The hiss is gone.",
    key: true,
  },
  { id: "2", time: "19:25", body: "First test take. The room echo is clear on the playback." },
  {
    id: "1",
    time: "19:00",
    title: "We are live from the studio",
    body: "Tonight we build a vocal booth from a wardrobe. Ask your questions in the chat.",
    pinned: true,
  },
]);
let n = 4;
// in a real page, new updates come from the server
function arrive() {
  updates.value = [
    { id: String(n), time: `19:${40 + n * 3}`, body: `Update ${n} from the studio.` },
    ...updates.value,
  ];
  n++;
}
</script>

<template>
  <BlessButton size="sm" variant="outline" style="margin-bottom: 12px" @click="arrive"
    >Simulate a new update</BlessButton
  >
  <BlessLiveBlog :updates live style="max-width: 560px" />
</template>
