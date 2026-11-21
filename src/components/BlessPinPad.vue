<template>
  <div
    class="bless-pinpad"
    :class="{ 'bless-pinpad--invalid': invalid, 'bless-pinpad--disabled': disabled }"
    role="group"
    :aria-label="text.pin"
    @keydown="onKey"
  >
    <div class="bless-pinpad__dots" aria-hidden="true">
      <span
        v-for="i in length"
        :key="i"
        class="bless-pinpad__dot"
        :class="{ 'bless-pinpad__dot--on': i <= model.length }"
      />
    </div>
    <span class="bless-sr" aria-live="polite">{{ text.entered(model.length, length) }}</span>
    <input v-if="name" type="hidden" :name :value="model" />
    <div class="bless-pinpad__keys">
      <BlessButton
        v-for="d in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
        :key="d"
        variant="outline"
        size="lg"
        :disabled="disabled"
        @click="press(d)"
        >{{ d }}</BlessButton
      >
      <BlessButton variant="ghost" size="lg" :disabled="disabled" @click="clear">{{
        text.clear
      }}</BlessButton>
      <BlessButton variant="outline" size="lg" :disabled="disabled" @click="press('0')"
        >0</BlessButton
      >
      <BlessButton
        variant="ghost"
        size="lg"
        :disabled="disabled"
        :aria-label="text.delete"
        @click="back"
        ><span aria-hidden="true">⌫</span></BlessButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import "./sr.css";

defineOptions({ name: "BlessPinPad" });
const pack = useLabelPack("BlessPinPad");

const props = withDefaults(
  defineProps<{
    /** digits in the PIN */
    length?: number;
    /** submitted with the form as the PIN */
    name?: string;
    disabled?: boolean;
    /** the PIN was wrong: the dots turn red until the next key */
    invalid?: boolean;
    labels?: Partial<{
      /** the name of the pad */
      pin: string;
      entered: (n: number, length: number) => string;
      delete: string;
      clear: string;
    }>;
  }>(),
  { length: 4 },
);
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ finish: [pin: string] }>();

const text = computed(() => ({
  pin: "PIN",
  entered: (n: number, l: number) => `${n} of ${l} digits entered`,
  delete: "Delete",
  clear: "Clear",
  ...pack(),
  ...props.labels,
}));
const full = computed(() => model.value.length >= props.length);

function press(d: string) {
  if (props.disabled || full.value) return;
  // with a parent v-model, model.value updates on the next render: use the new value directly
  const next = model.value + d;
  model.value = next;
  if (next.length >= props.length) emit("finish", next);
}
const back = () => !props.disabled && (model.value = model.value.slice(0, -1));
const clear = () => !props.disabled && (model.value = "");

// a hardware keyboard works too, while focus is anywhere inside the pad
function onKey(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^\d$/.test(e.key)) press(e.key);
  else if (e.key === "Backspace") back();
  else if (e.key === "Delete") clear();
  else return;
  e.preventDefault();
}
</script>

<style>
.bless-pinpad {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-6);
  font-family: var(--bless-font-sans);
}
.bless-pinpad__dots {
  display: flex;
  gap: var(--bless-space-3);
}
.bless-pinpad__dot {
  width: 14px;
  height: 14px;
  border: var(--bless-border-width) solid var(--bless-color-text);
}
/* a digit entered is a choice made: it fills */
.bless-pinpad__dot--on {
  background: var(--bless-color-text);
}
.bless-pinpad--invalid .bless-pinpad__dot {
  border-color: var(--bless-color-danger);
}
.bless-pinpad--invalid .bless-pinpad__dot--on {
  background: var(--bless-color-danger);
}
.bless-pinpad__keys {
  display: grid;
  grid-template-columns: repeat(3, minmax(64px, 1fr));
  gap: var(--bless-space-2);
}
.bless-pinpad__keys > .bless-button {
  font-size: var(--bless-text-lg);
  font-variant-numeric: tabular-nums;
}
</style>
