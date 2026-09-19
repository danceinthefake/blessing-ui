<script setup lang="ts">
import BlessTreeItem from "./BlessTreeItem.vue";
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessTree" });

withDefaults(defineProps<{ nodes: BlessTreeNode[]; label?: string }>(), { label: "Tree" });
const selected = defineModel<string | undefined>("selected");
const emit = defineEmits<{ select: [node: BlessTreeNode, path: string] }>();
function onSelect(n: BlessTreeNode, p: string) {
  selected.value = n.id ?? p;
  emit("select", n, p);
}
</script>

<template>
  <ul class="bless-tree" role="tree" :aria-label="label">
    <BlessTreeItem
      v-for="(n, i) in nodes"
      :key="n.id ?? i"
      :node="n"
      :path="String(n.id ?? i)"
      :selected
      :level="1"
      @select="onSelect"
    />
  </ul>
</template>

<style>
/* ponytail: branches are native <details>, so Enter/Space toggles on the summary;
 * ←/→/↑/↓ tree navigation not implemented — add if a consumer asks */
.bless-tree,
.bless-tree__group {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-tree__group {
  padding-left: var(--bless-space-4);
  border-left: var(--bless-border-width) solid var(--bless-color-border);
  margin-left: 9px;
}
.bless-tree__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
  width: 100%;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  line-height: var(--bless-leading-normal);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  list-style: none;
}
.bless-tree__row::-webkit-details-marker {
  display: none;
}
.bless-tree__row:hover {
  background: var(--bless-color-surface);
}
.bless-tree__row:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-tree__row--selected {
  color: var(--bless-color-accent);
  font-weight: var(--bless-font-weight-bold);
}
.bless-tree__row--leaf {
  padding-left: calc(var(--bless-space-2) + 14px);
}
.bless-tree__chevron {
  display: inline-block;
  width: 10px;
  color: var(--bless-color-text-muted);
  transition: transform var(--bless-duration-base);
}
.bless-tree__branch[open] > .bless-tree__row .bless-tree__chevron {
  transform: rotate(90deg);
}
.bless-tree__icon {
  width: 1.2em;
  text-align: center;
}
.bless-tree__item[aria-disabled="true"] > .bless-tree__row,
.bless-tree__row:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
