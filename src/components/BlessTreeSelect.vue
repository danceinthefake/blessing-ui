<script setup lang="ts">
import { computed, ref } from "vue";
import BlessChip from "./BlessChip.vue";
import BlessPopover from "./BlessPopover.vue";
import BlessTree from "./BlessTree.vue";
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessTreeSelect" });

const props = withDefaults(
  defineProps<{
    nodes: BlessTreeNode[];
    multiple?: boolean;
    placeholder?: string;
    /** only leaves (no children) can be picked */
    leafOnly?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    label?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  { placeholder: "Select…", leafOnly: false, size: "md", label: "Tree select" },
);
/** node id (or path) — string[] when multiple */
const model = defineModel<string | string[] | undefined>();
const emit = defineEmits<{ select: [node: BlessTreeNode, id: string] }>();
const open = ref(false);

function labelOf(id: string, list = props.nodes, path = ""): string | undefined {
  for (const [i, n] of list.entries()) {
    const nid = n.id ?? (path ? `${path}/${i}` : String(i));
    if (nid === id) return n.label;
    const r = n.children && labelOf(id, n.children, nid);
    if (r) return r;
  }
}
const chosen = computed(() =>
  Array.isArray(model.value) ? model.value : model.value ? [model.value] : [],
);
const single = computed(() => (!props.multiple && chosen.value[0] ? labelOf(chosen.value[0]) : ""));

function onSelect(n: BlessTreeNode, path: string) {
  if (props.leafOnly && n.children?.length) return;
  const id = n.id ?? path;
  emit("select", n, id);
  if (props.multiple) {
    const cur = chosen.value;
    model.value = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  } else {
    model.value = id;
    open.value = false;
  }
}
const remove = (id: string) => (model.value = chosen.value.filter((x) => x !== id));
</script>

<template>
  <BlessPopover v-model:open="open" placement="bottom-start" class="bless-treeselect">
    <template #trigger>
      <div
        role="combobox"
        tabindex="0"
        class="bless-treeselect__trigger"
        :class="[
          `bless-treeselect__trigger--${size}`,
          { 'bless-treeselect__trigger--invalid': invalid },
        ]"
        :aria-disabled="disabled || undefined"
        :aria-label="label"
        :aria-invalid="invalid || undefined"
        aria-haspopup="tree"
        :aria-expanded="open"
        @keydown.enter.prevent="!disabled && (open = !open)"
        @keydown.space.prevent="!disabled && (open = !open)"
      >
        <span v-if="multiple && chosen.length" class="bless-treeselect__chips">
          <BlessChip
            v-for="id in chosen"
            :key="id"
            :label="labelOf(id) ?? id"
            size="sm"
            removable
            @remove="remove(id)"
          />
        </span>
        <span
          v-else
          class="bless-treeselect__text"
          :class="{ 'bless-treeselect__text--empty': !single }"
          >{{ single || placeholder }}</span
        >
        <span class="bless-treeselect__chevron" aria-hidden="true" />
      </div>
    </template>
    <div class="bless-treeselect__panel">
      <BlessTree
        :nodes
        :selected="multiple ? undefined : (model as string | undefined)"
        :label
        @select="onSelect"
      >
      </BlessTree>
    </div>
  </BlessPopover>
</template>

<style>
.bless-treeselect__trigger {
  --_h: 40px;
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-width: 220px;
  min-height: var(--_h);
  padding: var(--bless-space-1) var(--bless-space-3);
  border: 0;
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font: inherit;
  font-family: var(--bless-font-sans);
  text-align: start;
  cursor: pointer;
}
.bless-treeselect__trigger--sm {
  --_h: 32px;
  font-size: var(--bless-text-sm);
}
.bless-treeselect__trigger--lg {
  --_h: 48px;
  font-size: var(--bless-text-lg);
}
.bless-treeselect__trigger {
  cursor: pointer;
}
.bless-treeselect__trigger:focus-visible {
  outline: 0;
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-treeselect__trigger--invalid {
  border-bottom-color: var(--bless-color-danger);
}
.bless-treeselect__trigger[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-treeselect__text {
  flex: 1;
}
.bless-treeselect__text--empty {
  color: var(--bless-color-text-muted);
}
.bless-treeselect__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
  flex: 1;
}
.bless-treeselect__chevron {
  width: 8px;
  height: 8px;
  border-inline-end: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
}
.bless-treeselect__panel {
  min-width: 240px;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: thin;
}
/* multiple: mark chosen rows */
.bless-treeselect .bless-tree__row[aria-pressed="true"] {
  color: var(--bless-color-accent-text);
}
</style>
