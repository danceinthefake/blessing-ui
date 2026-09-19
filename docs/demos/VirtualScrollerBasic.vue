<script setup lang="ts">
import { useTemplateRef } from "vue";
import { BlessButton, BlessVirtualScroller } from "blessing-ui";
const rows = Array.from({ length: 50000 }, (_, i) => ({
  id: i,
  title: `第${i + 1}話`,
  views: 1000 + ((i * 7919) % 9000),
}));
const vs = useTemplateRef<{ scrollTo: (i: number) => void }>("vs");
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessVirtualScroller
      ref="vs"
      :items="rows"
      :item-height="36"
      height="240px"
      :row-key="(r) => r.id"
      label="Episodes"
      style="border: 1px solid var(--bless-color-border)"
    >
      <template #default="{ item, index }">
        <span style="width: 3em; color: var(--bless-color-text-muted)">{{ index + 1 }}</span>
        <span style="flex: 1">{{ item.title }}</span>
        <span>{{ item.views.toLocaleString() }}</span>
      </template>
    </BlessVirtualScroller>
    <div class="row">
      <small>50,000 rows, ~12 in the DOM</small>
      <BlessButton size="sm" variant="outline" @click="vs?.scrollTo(25000)"
        >jump to 25,001</BlessButton
      >
    </div>
  </div>
</template>
