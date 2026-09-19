<script setup lang="ts">
import { ref } from "vue";
import { BlessOrderList } from "blessing-ui";
const eps = ref([
  "第1話 プロローグ",
  "第2話 運命の出会い",
  "第3話 フラグの立たない",
  "第4話 冴えない彼女",
]);
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessOrderList v-model="eps" />
    <small>drag, ↑ ↓ buttons, or focus a row and Alt+↑/↓</small>
  </div>
</template>
