<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useFieldState } from "../composables/useFieldId";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessKeyValueEditor" });
const pack = useLabelPack("BlessKeyValueEditor");

export interface BlessKeyValue {
  key: string;
  value: string;
  /** off keeps the row but leaves it out; only with `toggle` */
  enabled?: boolean;
}

const props = defineProps<{
  /** an on and off box per row */
  toggle?: boolean;
  /** hide the values, for secrets */
  secret?: boolean;
  disabled?: boolean;
  labels?: Partial<{
    key: string;
    value: string;
    enabled: string;
    remove: string;
    duplicate: string;
  }>;
}>();
const rows = defineModel<BlessKeyValue[]>({ default: () => [] });

const text = computed(() => ({
  key: "Key",
  value: "Value",
  enabled: "On",
  remove: "Remove",
  duplicate: "This key is used more than once",
  ...pack(),
  ...props.labels,
}));

// the rows and one empty row at the end: typing in it adds a row
const shown = computed(() => [...rows.value, { key: "", value: "", enabled: true }]);
const dupes = computed(() => {
  const seen = new Map<string, number>();
  for (const r of rows.value) if (r.key) seen.set(r.key, (seen.get(r.key) ?? 0) + 1);
  return new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));
});

function edit(i: number, patch: Partial<BlessKeyValue>) {
  const next = [...rows.value];
  next[i] = { ...(next[i] ?? { key: "", value: "", enabled: true }), ...patch };
  rows.value = next;
}
// in a BlessField, its label names the group
const fs = useFieldState();
const root = ref<HTMLElement>();
function remove(i: number) {
  rows.value = rows.value.filter((_, j) => j !== i);
  // focus stays in the list: the key of the row that took this place
  nextTick(() => root.value?.querySelectorAll<HTMLElement>(".bless-kv__key")[i]?.focus());
}
</script>

<template>
  <div
    ref="root"
    class="bless-kv"
    :class="{ 'bless-kv--toggle': toggle }"
    role="group"
    :aria-labelledby="fs.labelledby"
  >
    <div class="bless-kv__head" aria-hidden="true">
      <span v-if="toggle" />
      <span>{{ text.key }}</span>
      <span>{{ text.value }}</span>
      <span />
    </div>
    <div
      v-for="(r, i) in shown"
      :key="i"
      class="bless-kv__row"
      :class="{ 'bless-kv__row--off': toggle && r.enabled === false }"
    >
      <input
        v-if="toggle"
        type="checkbox"
        class="bless-kv__on"
        :checked="r.enabled !== false"
        :disabled="disabled || i === rows.length"
        :aria-label="`${text.enabled} ${i + 1}`"
        @change="edit(i, { enabled: ($event.target as HTMLInputElement).checked })"
      />
      <input
        class="bless-kv__input bless-kv__key"
        :value="r.key"
        :disabled
        :placeholder="text.key"
        :aria-label="`${text.key} ${i + 1}`"
        :aria-invalid="dupes.has(r.key) ? 'true' : undefined"
        :title="dupes.has(r.key) ? text.duplicate : undefined"
        spellcheck="false"
        autocomplete="off"
        @input="edit(i, { key: ($event.target as HTMLInputElement).value })"
      />
      <input
        class="bless-kv__input"
        :type="secret ? 'password' : 'text'"
        :value="r.value"
        :disabled
        :placeholder="text.value"
        :aria-label="`${text.value} ${i + 1}`"
        spellcheck="false"
        autocomplete="off"
        @input="edit(i, { value: ($event.target as HTMLInputElement).value })"
      />
      <button
        v-if="i < rows.length"
        type="button"
        class="bless-kv__remove"
        :disabled
        :aria-label="`${text.remove} ${r.key || i + 1}`"
        @click="remove(i)"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
      <span v-else />
    </div>
    <p v-if="dupes.size" class="bless-kv__error" role="status">{{ text.duplicate }}</p>
  </div>
</template>

<style>
.bless-kv {
  --_cols: minmax(0, 1fr) minmax(0, 2fr) 32px;
  display: grid;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-kv--toggle {
  --_cols: 28px minmax(0, 1fr) minmax(0, 2fr) 32px;
}
.bless-kv__head,
.bless-kv__row {
  display: grid;
  grid-template-columns: var(--_cols);
  align-items: center;
}
.bless-kv__head {
  padding-block-end: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
/* fuse when grouped: one table of cells, each line drawn once */
.bless-kv__row + .bless-kv__row {
  margin-block-start: calc(-1 * var(--bless-border-width));
}
.bless-kv__input {
  box-sizing: border-box;
  inline-size: 100%;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: var(--bless-text-sm);
}
.bless-kv__input + .bless-kv__input {
  margin-inline-start: calc(-1 * var(--bless-border-width));
  inline-size: calc(100% + var(--bless-border-width));
}
.bless-kv__input:focus-visible {
  position: relative;
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -1px;
}
.bless-kv__input[aria-invalid="true"] {
  position: relative;
  border-color: var(--bless-color-danger);
}
.bless-kv__row--off .bless-kv__input {
  color: var(--bless-color-text-muted);
  text-decoration: line-through;
}
.bless-kv__on {
  justify-self: center;
  margin: 0;
  accent-color: var(--bless-color-accent);
}
.bless-kv__remove {
  display: grid;
  place-items: center;
  justify-self: center;
  inline-size: 28px;
  block-size: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-kv__remove:hover {
  color: var(--bless-color-danger-text);
}
.bless-kv__remove:focus-visible,
.bless-kv__on:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-kv input:disabled,
.bless-kv__remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bless-kv__error {
  margin: var(--bless-space-2) 0 0;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-danger-text);
}
</style>
