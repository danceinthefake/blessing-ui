<script setup lang="ts">
import { BlessText, BlessVirtualScroller } from "blessing-ui";
const rows = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  text: "lorem ipsum ".repeat(1 + ((i * 7) % 9)),
}));
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessVirtualScroller
      :items="rows"
      :item-height="40"
      dynamic
      height="240px"
      :row-key="(r) => r.id"
      label="Notes"
      style="border: 1px solid var(--bless-color-border)"
    >
      <template #default="{ item, index }">
        <div style="padding: 8px 0">
          <BlessText as="p" size="xs" muted>#{{ index + 1 }}</BlessText>
          <BlessText as="p" size="sm">{{ item.text }}</BlessText>
        </div>
      </template>
    </BlessVirtualScroller>
    <small
      >rows of different heights — measured as they render, `itemHeight` is only the estimate</small
    >
  </div>
</template>
