<script setup lang="ts">
import { ref } from "vue";
import { BlessSortable } from "blessing-ui";
const eps = ref([
  "第1話 プロローグ",
  "第2話 運命の出会い",
  "第3話 フラグの立たない",
  "第4話 冴えない彼女",
]);
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessSortable v-model="eps" label="Episodes" />
    <small>drag the grip, or focus it and press Space, then ↑ ↓</small>
  </div>
</template>
