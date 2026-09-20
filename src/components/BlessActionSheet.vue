<script setup lang="ts">
import BlessDrawer from "./BlessDrawer.vue";

defineOptions({ name: "BlessActionSheet" });

export interface BlessAction {
  label: string;
  value: string;
  icon?: string;
  description?: string;
  danger?: boolean;
  disabled?: boolean;
}

withDefaults(
  defineProps<{
    actions: BlessAction[];
    title?: string;
    /** icon grid instead of a list */
    grid?: boolean;
    cancelLabel?: string;
    /** show a cancel row at the bottom */
    cancel?: boolean;
  }>(),
  { cancelLabel: "Cancel", cancel: true },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ select: [action: BlessAction]; cancel: [] }>();
function pick(a: BlessAction) {
  if (a.disabled) return;
  emit("select", a);
  open.value = false;
}
</script>

<template>
  <BlessDrawer v-model="open" :title class="bless-actionsheet" @close="emit('cancel')">
    <div
      class="bless-actionsheet__list"
      :class="{ 'bless-actionsheet__list--grid': grid }"
      role="group"
      :aria-label="title ?? 'Actions'"
    >
      <button
        v-for="a in actions"
        :key="a.value"
        type="button"
        class="bless-actionsheet__item"
        :class="{ 'bless-actionsheet__item--danger': a.danger }"
        :disabled="a.disabled"
        @click="pick(a)"
      >
        <span v-if="a.icon" class="bless-actionsheet__icon" aria-hidden="true">{{ a.icon }}</span>
        <span class="bless-actionsheet__text">
          <span class="bless-actionsheet__label">{{ a.label }}</span>
          <span v-if="a.description && !grid" class="bless-actionsheet__desc">{{
            a.description
          }}</span>
        </span>
      </button>
    </div>
    <template v-if="cancel" #footer>
      <button type="button" class="bless-actionsheet__cancel" @click="open = false">
        {{ cancelLabel }}
      </button>
    </template>
  </BlessDrawer>
</template>

<style>
.bless-actionsheet__list {
  display: flex;
  flex-direction: column;
}
.bless-actionsheet__list--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: var(--bless-space-2);
}
.bless-actionsheet__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  width: 100%;
  min-height: 48px;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  font-family: var(--bless-font-sans);
  text-align: left;
  cursor: pointer;
}
.bless-actionsheet__list--grid .bless-actionsheet__item {
  flex-direction: column;
  justify-content: center;
  gap: var(--bless-space-1);
  text-align: center;
  background: var(--bless-color-surface);
}
.bless-actionsheet__item + .bless-actionsheet__item {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-actionsheet__list--grid .bless-actionsheet__item + .bless-actionsheet__item {
  border-top: 0;
}
.bless-actionsheet__item:hover:not(:disabled) {
  background: var(--bless-color-surface);
}
.bless-actionsheet__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-actionsheet__item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-actionsheet__item--danger {
  color: var(--bless-color-danger);
}
.bless-actionsheet__icon {
  width: 1.5em;
  font-size: var(--bless-text-md);
  text-align: center;
}
.bless-actionsheet__text {
  display: flex;
  flex-direction: column;
}
.bless-actionsheet__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-actionsheet__desc {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-actionsheet__cancel {
  width: 100%;
  padding: var(--bless-space-3);
  border: 0;
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font: inherit;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-actionsheet__cancel:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
</style>
