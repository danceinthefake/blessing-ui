<template>
  <div class="novel-demo">
    <BlessNovelBox
      :name="lines[i]!.name"
      :text="lines[i]!.text"
      interactive
      @next="i = (i + 1) % lines.length"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessNovelBox } from "blessing-ui";

const lines = [
  {
    name: "Megumi",
    text: "Three new tracks came out while you were away. The newest one is ready to play.",
  },
  {
    name: "Utaha",
    text: "Click the arrow while a line is typing to show it at once. Reduced or calm motion skips the typing.",
  },
  {
    name: "Eriri",
    text: "Screen readers receive the full line immediately, while the visible text types out letter by letter.",
  },
];
const i = ref(0);
</script>

<style scoped>
.novel-demo {
  padding-top: 8px;
}
</style>
