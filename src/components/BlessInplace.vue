<script setup lang="ts">
import { nextTick, ref } from "vue";

defineOptions({ name: "BlessInplace" });
withDefaults(defineProps<{ closable?: boolean; disabled?: boolean; closeLabel?: string }>(), {
  closeLabel: "Close",
});
const active = defineModel<boolean>("active", { default: false });
const emit = defineEmits<{ open: []; close: [] }>();
const root = ref<HTMLElement>();
// The button that had focus is replaced by the content (and back), so focus has to be moved by
// hand or it falls to <body>: into the first control on open, back to the display on close.
const focusIn = (sel: string) =>
  nextTick(() => root.value?.querySelector<HTMLElement>(sel)?.focus());
function open() {
  active.value = true;
  emit("open");
  focusIn(
    "input, textarea, select, [contenteditable], button, [href], [tabindex]:not([tabindex='-1'])",
  );
}
function close() {
  if (!active.value) return;
  active.value = false;
  emit("close");
  focusIn(".bless-inplace__display");
}
</script>

<template>
  <div
    ref="root"
    class="bless-inplace"
    :class="{ 'bless-inplace--active': active, 'bless-inplace--disabled': disabled }"
  >
    <button v-if="!active" type="button" class="bless-inplace__display" :disabled @click="open">
      <slot name="display" />
    </button>
    <div v-else class="bless-inplace__content" @keydown.esc.stop="close">
      <slot name="content" :close />
      <button
        v-if="closable"
        type="button"
        class="bless-inplace__close"
        :aria-label="closeLabel"
        @click="close"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  </div>
</template>

<style>
.bless-inplace {
  display: inline-block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-inplace__display {
  border-radius: var(--bless-radius);
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) dashed transparent;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: text;
}
.bless-inplace__display:hover {
  border-color: var(--bless-color-text-muted);
  background: var(--bless-color-surface);
}
.bless-inplace__display:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-inplace__content {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-inplace__close {
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
}
.bless-inplace__close:hover {
  color: var(--bless-color-danger);
}
.bless-inplace--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
