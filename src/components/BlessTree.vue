<script setup lang="ts">
import { ref } from "vue";
import { logicalKey } from "../composables/rtl";
import BlessTreeItem from "./BlessTreeItem.vue";
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessTree" });
const root = ref<HTMLElement>();
// WAI-ARIA tree keys over the visible rows: ↑↓ move, → opens / enters, ← closes / goes to parent, Home / End
const rows = () =>
  Array.from(root.value?.querySelectorAll<HTMLElement>(".bless-tree__row") ?? []).filter(
    (el) => el.offsetParent !== null,
  );
function onKey(e: KeyboardEvent) {
  const list = rows();
  const cur = (e.target as HTMLElement).closest<HTMLElement>(".bless-tree__row");
  const i = cur ? list.indexOf(cur) : -1;
  if (i < 0) return;
  const details = cur!.parentElement as HTMLDetailsElement | null;
  const isBranch = details?.tagName === "DETAILS";
  const focus = (el?: HTMLElement) => el && (e.preventDefault(), el.focus());
  switch (logicalKey(e)) {
    case "ArrowDown":
      return focus(list[i + 1]);
    case "ArrowUp":
      return focus(list[i - 1]);
    case "Home":
      return focus(list[0]);
    case "End":
      return focus(list.at(-1));
    case "ArrowRight":
      if (isBranch && !details!.open) (e.preventDefault(), (details!.open = true));
      else if (isBranch) focus(list[i + 1]);
      return;
    case "ArrowLeft":
      if (isBranch && details!.open) (e.preventDefault(), (details!.open = false));
      else
        focus(
          cur!
            .closest<HTMLElement>(".bless-tree__group")
            ?.parentElement?.querySelector<HTMLElement>(":scope > .bless-tree__row") ?? undefined,
        );
      return;
  }
}

withDefaults(defineProps<{ nodes: BlessTreeNode[]; label?: string }>(), { label: "Tree" });
const selected = defineModel<string | undefined>("selected");
const emit = defineEmits<{ select: [node: BlessTreeNode, path: string] }>();
function onSelect(n: BlessTreeNode, p: string) {
  selected.value = n.id ?? p;
  emit("select", n, p);
}
</script>

<template>
  <ul ref="root" class="bless-tree" role="tree" :aria-label="label" @keydown="onKey">
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
  padding-inline-start: var(--bless-space-4);
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
  margin-inline-start: 9px;
}
.bless-tree__row {
  border-radius: var(--bless-radius);
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
  text-align: start;
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
  color: var(--bless-color-accent-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-tree__row--leaf {
  padding-inline-start: calc(var(--bless-space-2) + 14px);
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
