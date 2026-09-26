<script setup lang="ts">
import { nextTick, ref } from "vue";
import { BlessChip } from "blessing-ui";
import { shots } from "./_data";
const tags = ref(["megumi", "eriri", "utaha"]);
const row = ref<HTMLElement>();
// the × that had focus is gone: hand focus to the chip that took its place, or the one before
async function remove(i: number) {
  tags.value.splice(i, 1);
  await nextTick();
  const xs = row.value?.querySelectorAll<HTMLButtonElement>(".bless-chip__remove") ?? [];
  xs[Math.min(i, xs.length - 1)]?.focus();
}
</script>

<template>
  <div ref="row" class="row">
    <BlessChip v-for="(t, i) in tags" :key="t" :label="t" removable @remove="remove(i)" />
    <BlessChip label="EP.12" color="text" size="sm" />
    <BlessChip label="Eriri" :image="shots[0].src" />
  </div>
</template>
