<template>
  <div class="icon-demo">
    <div class="row">
      <BlessIcon v-for="s in sizes" :key="s" name="play" :size="s" />
      <BlessIcon name="external" size="32px" label="Opens in a new tab" />
      <BlessButton>
        <template #prefix><BlessIcon name="play" size="sm" /></template>
        Play
      </BlessButton>
    </div>
    <div class="icon-grid">
      <div v-for="n in names" :key="n" class="icon-cell">
        <BlessIcon :name="n" size="lg" />
        <span>{{ n }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlessButton, BlessIcon, blessIcons, type BlessIconName } from "blessing-ui";
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const names = Object.keys(blessIcons) as BlessIconName[];
</script>

<style scoped>
.icon-demo {
  display: grid;
  gap: 20px;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 10px;
}
.icon-cell {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-surface);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
