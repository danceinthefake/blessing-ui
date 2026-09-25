<script setup lang="ts">
defineOptions({ name: "BlessList" });

withDefaults(defineProps<{ divided?: boolean }>(), { divided: true });
// role="list" on the <ul>: Safari drops list semantics from a list styled with list-style: none
</script>

<template>
  <ul class="bless-list" :class="{ 'bless-list--divided': divided }" role="list">
    <slot />
  </ul>
</template>

<style>
.bless-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
}
.bless-list--divided > .bless-list-item + .bless-list-item {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
