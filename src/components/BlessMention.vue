<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";
import { useFloating } from "../composables/useFloating";
import BlessTextarea from "./BlessTextarea.vue";

defineOptions({ name: "BlessMention", inheritAttrs: false });

export interface BlessMentionOption {
  /** inserted after the trigger: `@mika` */
  value: string;
  label: string;
  /** muted second line, e.g. a role or an email */
  hint?: string;
}

const props = withDefaults(
  defineProps<{
    /** one list for every trigger, or `{ "@": [...], "#": [...] }` to give each its own */
    options: BlessMentionOption[] | Record<string, BlessMentionOption[]>;
    /** characters that open the list when they start a word; ignored when `options` is a record */
    triggers?: string[];
    limit?: number;
    label?: string;
  }>(),
  { triggers: () => ["@"], limit: 8, label: "Suggestions" },
);
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ select: [option: BlessMentionOption, trigger: string] }>();

const id = useId();
const root = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const open = ref(false);
const active = ref(0);
/** the trigger, the text typed after it, and where the trigger sits in the value */
const at = ref({ trigger: "", query: "", start: 0 });
const { x, y } = useFloating(root, panel, open, { placement: "bottom-start", offset: 4 });

const keys = computed(() =>
  Array.isArray(props.options) ? props.triggers : Object.keys(props.options),
);
const matches = computed(() => {
  const list = Array.isArray(props.options)
    ? props.options
    : (props.options[at.value.trigger] ?? []);
  const q = at.value.query.toLowerCase();
  return list
    .filter((o) => !q || o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
    .slice(0, props.limit);
});
const field = () => root.value?.querySelector("textarea") ?? null;

/** is the caret inside `<trigger><word>` that starts a word? */
function detect() {
  const el = field();
  if (!el || el.selectionStart !== el.selectionEnd) return close();
  const caret = el.selectionStart;
  const before = el.value.slice(0, caret);
  const m = /(^|\s)(\S)([^\s]*)$/.exec(before);
  if (!m || !keys.value.includes(m[2]!)) return close();
  const next = { trigger: m[2]!, query: m[3]!, start: caret - m[2]!.length - m[3]!.length };
  if (next.trigger !== at.value.trigger || next.query !== at.value.query) active.value = 0;
  at.value = next;
  open.value = matches.value.length > 0;
}
const close = () => (open.value = false);

function pick(o: BlessMentionOption) {
  const el = field();
  if (!el) return;
  const { trigger, start } = at.value;
  const ins = `${trigger}${o.value} `;
  const caret = el.selectionStart;
  model.value = el.value.slice(0, start) + ins + el.value.slice(caret);
  emit("select", o, trigger);
  close();
  nextTick(() => {
    el.focus();
    el.setSelectionRange(start + ins.length, start + ins.length);
  });
}
function onKey(e: KeyboardEvent) {
  if (!open.value || e.isComposing) return;
  const n = matches.value.length;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    active.value = (active.value + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
  } else if (e.key === "Enter" || e.key === "Tab") {
    e.preventDefault();
    pick(matches.value[active.value]!);
  } else if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    close();
  }
}
const check = () => nextTick(detect);

watch(open, (o) =>
  nextTick(() => {
    const el = panel.value;
    if (!el || typeof el.showPopover !== "function") return;
    if (o && !el.matches(":popover-open")) el.showPopover();
    else if (!o && el.matches(":popover-open")) el.hidePopover();
  }),
);
</script>

<template>
  <div
    ref="root"
    class="bless-mention"
    @input="check"
    @keydown="onKey"
    @keyup.left="check"
    @keyup.right="check"
    @click="check"
    @focusout="close"
  >
    <BlessTextarea
      v-bind="$attrs"
      v-model="model"
      role="combobox"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="`${id}-list`"
      :aria-activedescendant="open ? `${id}-opt-${active}` : undefined"
    />
    <div
      ref="panel"
      popover="manual"
      class="bless-mention__panel"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
        minWidth: root ? `${Math.min(root.offsetWidth, 280)}px` : undefined,
      }"
    >
      <div :id="`${id}-list`" role="listbox" :aria-label="label" class="bless-mention__list">
        <div
          v-for="(o, i) in open ? matches : []"
          :id="`${id}-opt-${i}`"
          :key="o.value"
          role="option"
          class="bless-mention__option"
          :class="{ 'bless-mention__option--active': i === active }"
          :aria-selected="i === active"
          @mousedown.prevent="pick(o)"
          @mousemove="active = i"
        >
          <span>{{ o.label }}</span>
          <small v-if="o.hint">{{ o.hint }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bless-mention {
  position: relative;
}
.bless-mention__panel {
  position: fixed;
  inset: unset;
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-plate);
}
.bless-mention__list {
  max-height: 240px;
  overflow-y: auto;
  padding: var(--bless-space-1) 0;
  scrollbar-width: thin;
}
.bless-mention__option {
  display: flex;
  align-items: baseline;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  cursor: pointer;
}
.bless-mention__option small {
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-mention__option--active {
  background: var(--bless-color-surface);
}
</style>
