<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { logicalKey } from "../composables/rtl";

defineOptions({ name: "BlessInputOTP" });

const props = withDefaults(
  defineProps<{
    length?: number;
    /** digits only (inputmode numeric) or any char */
    numeric?: boolean;
    /** indexes after which to render a separator */
    separators?: number[];
    disabled?: boolean;
    invalid?: boolean;
    label?: string;
    masked?: boolean;
  }>(),
  { length: 6, numeric: true, separators: () => [] },
);

const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ complete: [code: string] }>();
const inputs = ref<HTMLInputElement[]>([]);
// cells keep gaps ("12_456"); the model is their concatenation, so an empty middle cell
// never shifts later digits left
const fromModel = (v: string) => Array.from({ length: props.length }, (_, i) => v[i] ?? "");
const chars = ref<string[]>(fromModel(model.value));
watch(model, (v) => {
  if (v !== chars.value.join("")) chars.value = fromModel(v);
});
const pattern = computed(() => (props.numeric ? /\d/ : /./));

function commit(arr: string[]) {
  chars.value = arr;
  model.value = arr.join("");
  if (arr.every(Boolean)) emit("complete", model.value);
}
function set(i: number, ch: string) {
  const arr = chars.value.slice();
  arr[i] = ch;
  commit(arr);
}
function focus(i: number) {
  inputs.value[Math.max(0, Math.min(props.length - 1, i))]?.focus();
}
function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement;
  const v = el.value.replace(props.numeric ? /\D/g : /\s/g, "");
  if (!v) {
    el.value = ""; // rejected char (letter in numeric mode) must not linger
    return void set(i, "");
  }
  // typed or pasted several chars: spread forward
  const cs = v.split("").filter((c) => pattern.value.test(c));
  const arr = chars.value.slice();
  cs.forEach((c, k) => i + k < props.length && (arr[i + k] = c));
  commit(arr);
  el.value = arr[i] ?? "";
  focus(i + cs.length);
}
function onKey(i: number, e: KeyboardEvent) {
  if (e.key === "Backspace") {
    e.preventDefault();
    if (chars.value[i]) set(i, "");
    else {
      set(i - 1, "");
      focus(i - 1);
    }
  } else if (logicalKey(e) === "ArrowLeft") {
    e.preventDefault();
    focus(i - 1);
  } else if (logicalKey(e) === "ArrowRight") {
    e.preventDefault();
    focus(i + 1);
  } else if (e.key === "Delete") {
    e.preventDefault();
    set(i, "");
  }
}
function onPaste(i: number, e: ClipboardEvent) {
  e.preventDefault();
  const text = (e.clipboardData?.getData("text") ?? "").replace(props.numeric ? /\D/g : /\s/g, "");
  if (!text) return;
  const arr = chars.value.slice();
  text.split("").forEach((c, k) => i + k < props.length && (arr[i + k] = c));
  commit(arr);
  focus(i + text.length);
}
</script>

<template>
  <div
    class="bless-otp"
    :class="{ 'bless-otp--invalid': invalid, 'bless-otp--disabled': disabled }"
    role="group"
    :aria-label="label ?? 'One-time code'"
  >
    <template v-for="i in length" :key="i">
      <input
        :ref="
          (el) => {
            if (el) inputs[i - 1] = el as HTMLInputElement;
          }
        "
        :type="masked ? 'password' : 'text'"
        class="bless-otp__cell"
        :value="chars[i - 1]"
        :inputmode="numeric ? 'numeric' : 'text'"
        :pattern="numeric ? '[0-9]*' : undefined"
        :autocomplete="i === 1 ? 'one-time-code' : 'off'"
        maxlength="1"
        :disabled
        :aria-label="`${label ?? 'Digit'} ${i} of ${length}`"
        :aria-invalid="invalid || undefined"
        @input="onInput(i - 1, $event)"
        @keydown="onKey(i - 1, $event)"
        @paste="onPaste(i - 1, $event)"
        @focus="($event.target as HTMLInputElement).select()"
      />
      <span v-if="separators.includes(i)" class="bless-otp__sep" aria-hidden="true" />
    </template>
  </div>
</template>

<style>
.bless-otp {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
}
.bless-otp__cell {
  border-radius: var(--bless-radius);
  width: 40px;
  height: 48px;
  box-sizing: border-box;
  border: 0;
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  text-align: center;
  caret-color: var(--bless-color-accent-text);
  transform: skewX(var(--bless-skew));
  transition: border-color var(--bless-duration-base);
}
.bless-otp__cell:focus {
  outline: 0;
  border-bottom-color: var(--bless-color-accent-text);
  background: var(--bless-color-bg);
}
.bless-otp__cell:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-otp__sep {
  width: 10px;
  height: 2px;
  background: var(--bless-color-text-muted);
}
.bless-otp--invalid .bless-otp__cell {
  border-bottom-color: var(--bless-color-danger);
}
.bless-otp--disabled {
  opacity: 0.4;
}
</style>
