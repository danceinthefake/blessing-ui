<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";
import BlessChip from "./BlessChip.vue";
import BlessPopover from "./BlessPopover.vue";
import BlessTree from "./BlessTree.vue";
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessTreeSelect" });

const props = withDefaults(
  defineProps<{
    id?: string;
    nodes: BlessTreeNode[];
    multiple?: boolean;
    placeholder?: string;
    /** only leaves (no children) can be picked */
    leafOnly?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    /** accessible name when there's no Field; also names the tree */
    label?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  { placeholder: "Select…", leafOnly: false, size: "md" },
);
/** node id (or path) — string[] when multiple */
const model = defineModel<string | string[] | undefined>();
const emit = defineEmits<{ select: [node: BlessTreeNode, id: string] }>();
const open = ref(false);
const id = useFieldId(props);
const fs = useFieldState();
const panel = ref<HTMLElement>();
// opening moves focus into the tree (the picked row, else the first)
watch(open, (o) =>
  nextTick(() => {
    if (!o) return;
    const rows = panel.value?.querySelectorAll<HTMLElement>(".bless-tree__row");
    (panel.value?.querySelector<HTMLElement>(".bless-tree__row--selected") ?? rows?.[0])?.focus();
  }),
);
function onKey(e: KeyboardEvent) {
  if (props.disabled) return;
  if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
    e.preventDefault();
    open.value = e.key === "ArrowDown" ? true : !open.value;
  } else if (e.key === "Backspace" && props.multiple && chosen.value.length) {
    // chips inside the combobox can't hold their own buttons: Backspace removes the last pick
    remove(chosen.value[chosen.value.length - 1]);
  }
}

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
  <BlessPopover
    v-model:open="open"
    placement="bottom-start"
    class="bless-treeselect"
    :trigger="disabled ? 'manual' : 'click'"
  >
    <template #trigger>
      <div
        :id="id()"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        class="bless-treeselect__trigger"
        :class="[
          `bless-treeselect__trigger--${size}`,
          { 'bless-treeselect__trigger--invalid': invalid },
        ]"
        :aria-disabled="disabled || undefined"
        :aria-label="label ?? (fs.inField ? undefined : 'Tree select')"
        :aria-labelledby="label ? undefined : fs.labelledby"
        :aria-invalid="invalid || fs.invalid.value || undefined"
        :aria-describedby="fs.describedby.value"
        aria-haspopup="tree"
        :aria-expanded="open"
        @keydown="onKey"
      >
        <span v-if="multiple && chosen.length" class="bless-treeselect__chips">
          <BlessChip v-for="c in chosen" :key="c" :label="labelOf(c) ?? c" size="sm" />
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
    <div ref="panel" class="bless-treeselect__panel">
      <BlessTree
        :nodes
        :selected="multiple ? undefined : (model as string | undefined)"
        :label="label ?? 'Tree select'"
        @select="onSelect"
      >
      </BlessTree>
    </div>
  </BlessPopover>
</template>

<style>
.bless-treeselect__trigger {
  border-radius: var(--bless-radius-plate);
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
/* parallelogram trigger; content counter-skews so text stays upright */
.bless-treeselect__trigger {
  transform: skewX(var(--bless-skew));
  padding-inline: calc(var(--bless-space-3) + 4px);
}
.bless-treeselect__trigger > * {
  transform: skewX(var(--bless-skew-counter));
}
.bless-treeselect__trigger > .bless-treeselect__chevron {
  transform: skewX(var(--bless-skew-counter)) translateY(-2px) rotate(45deg);
}
</style>
