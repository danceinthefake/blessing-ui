<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useFieldId } from "../composables/useFieldId";
import { useFloating } from "../composables/useFloating";
import { fromISO } from "../composables/date";
import BlessCalendar from "./BlessCalendar.vue";

defineOptions({ name: "BlessDatePicker" });

const props = withDefaults(
  defineProps<{
    id?: string;
    range?: boolean;
    min?: string;
    max?: string;
    placeholder?: string;
    locale?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** prefer native <input type=date> on coarse pointers (touch) */
    nativeOnTouch?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  { locale: "ja-JP", nativeOnTouch: true, size: "md", placeholder: "Select date" },
);

const model = defineModel<string | [string, string] | undefined>();
const id = useFieldId(props)();
const open = ref(false);
const anchor = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const { x, y } = useFloating(anchor, panel, open, { placement: "bottom-start", offset: 4 });

const useNative = computed(
  () =>
    props.nativeOnTouch &&
    !props.range &&
    typeof matchMedia === "function" &&
    matchMedia("(pointer: coarse)").matches,
);
const fmt = new Intl.DateTimeFormat(props.locale, { dateStyle: "medium" });
const text = computed(() => {
  if (!model.value) return "";
  if (Array.isArray(model.value))
    return `${fmt.format(fromISO(model.value[0]))} – ${fmt.format(fromISO(model.value[1]))}`;
  return fmt.format(fromISO(model.value));
});

watch(open, (o) =>
  nextTick(() => {
    const el = panel.value;
    if (!el || typeof el.showPopover !== "function") return;
    if (o && !el.matches(":popover-open")) el.showPopover();
    else if (!o && el.matches(":popover-open")) el.hidePopover();
    if (o) nextTick(() => el.querySelector<HTMLElement>('[tabindex="0"]')?.focus());
  }),
);
watch(model, (v) => {
  if (!props.range || Array.isArray(v)) open.value = false;
});
function clear() {
  model.value = undefined;
}
</script>

<template>
  <div
    class="bless-datepicker"
    :class="[
      `bless-datepicker--${size}`,
      { 'bless-datepicker--invalid': invalid, 'bless-datepicker--disabled': disabled },
    ]"
  >
    <span v-if="useNative" class="bless-datepicker__field">
      <input
        :id
        v-model="model"
        type="date"
        :min
        :max
        :disabled
        class="bless-datepicker__native"
        :aria-invalid="invalid || undefined"
      />
    </span>
    <template v-else>
      <button
        ref="anchor"
        :id
        type="button"
        class="bless-datepicker__trigger"
        :disabled
        :aria-haspopup="'dialog'"
        :aria-expanded="open"
        :aria-invalid="invalid || undefined"
        @click="open = !open"
        @keydown.esc="open = false"
      >
        <span class="bless-datepicker__icon" aria-hidden="true">▦</span>
        <span
          class="bless-datepicker__text"
          :class="{ 'bless-datepicker__text--placeholder': !text }"
          >{{ text || placeholder }}</span
        >
      </button>
      <button
        v-if="text && !disabled"
        type="button"
        class="bless-datepicker__clear"
        aria-label="Clear"
        @click="clear"
      >
        ×
      </button>
      <div
        ref="panel"
        popover="auto"
        class="bless-datepicker__panel"
        :style="{ left: `${x}px`, top: `${y}px` }"
        role="dialog"
        @toggle="open = ($event as ToggleEvent).newState === 'open'"
      >
        <BlessCalendar v-model="model" :range :min :max :locale />
      </div>
    </template>
  </div>
</template>

<style>
.bless-datepicker {
  border-radius: var(--bless-radius);
  --_h: 40px;
  --_fs: var(--bless-text-md);
  display: inline-flex;
  align-items: stretch;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-datepicker--sm {
  --_h: 32px;
  --_fs: var(--bless-text-sm);
}
.bless-datepicker--lg {
  --_h: 48px;
  --_fs: var(--bless-text-lg);
}
.bless-datepicker__trigger,
.bless-datepicker__native {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-width: 200px;
  height: var(--_h);
  padding: 0 var(--bless-space-3);
  box-sizing: border-box;
  border: 0;
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  color: inherit;
  font: inherit;
  font-size: var(--_fs);
  text-align: start;
  cursor: pointer;
}
.bless-datepicker__trigger:focus-visible,
.bless-datepicker__native:focus-visible {
  outline: 0;
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-datepicker__trigger[aria-expanded="true"] {
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-datepicker__icon {
  color: var(--bless-color-text-muted);
}
.bless-datepicker__text {
  flex: 1;
}
.bless-datepicker__text--placeholder {
  color: var(--bless-color-text-muted);
}
.bless-datepicker__clear {
  border: 0;
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  font: inherit;
  color: var(--bless-color-text-muted);
  cursor: pointer;
  padding: 0 var(--bless-space-2);
}
.bless-datepicker--invalid .bless-datepicker__clear {
  border-bottom-color: var(--bless-color-danger);
}
.bless-datepicker__clear:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-datepicker__clear:hover {
  opacity: 1;
}
.bless-datepicker__panel {
  position: fixed;
  inset: unset;
  margin: 0;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  box-shadow: var(--bless-shadow-plate);
}
.bless-datepicker--invalid .bless-datepicker__trigger,
.bless-datepicker--invalid .bless-datepicker__native {
  border-bottom-color: var(--bless-color-danger);
}
.bless-datepicker--disabled {
  opacity: 0.4;
}
/* parallelogram field: the trigger, or a wrapper round the native date input; content stays upright */
.bless-datepicker__field {
  display: inline-flex;
  transform: skewX(var(--bless-skew));
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
}
.bless-datepicker__field:focus-within {
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-datepicker__field > .bless-datepicker__native {
  transform: skewX(var(--bless-skew-counter));
  padding-inline: calc(var(--bless-space-3) + 4px);
  background: transparent;
  border-bottom: 0;
}
.bless-datepicker__trigger {
  transform: skewX(var(--bless-skew));
  padding-inline: calc(var(--bless-space-3) + 4px);
}
.bless-datepicker__trigger > * {
  transform: skewX(var(--bless-skew-counter));
}
</style>
