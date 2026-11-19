<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { readStore, writeStore } from "../composables/storage";
import { nextTick, onMounted, ref, computed } from "vue";
import { reducedMotion } from "../composables/useMedia";

defineOptions({ name: "BlessSplash" });

const props = withDefaults(
  defineProps<{
    /** localStorage key; splash shows once per key. Omit to show every load */
    once?: string;
    /** auto-dismiss after ms; 0 = manual only */
    duration?: number;
    /** the dialog's accessible name */
    label?: string;
    labels?: Partial<{ skip: string }>;
  }>(),
  { duration: 2500, label: "Welcome" },
);
const pack = useLabelPack("BlessSplash");
const text = computed(() => ({
  skip: "Skip",
  ...pack(),
  ...props.labels,
}));

const emit = defineEmits<{ finish: [] }>();
const show = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
const skip = ref<HTMLButtonElement>();
let before: HTMLElement | null = null;

function dismiss() {
  if (!show.value) return;
  clearTimeout(timer);
  show.value = false;
  // Skip goes with the splash: hand focus back to where it was, if anywhere
  if (before && before !== document.body && before.isConnected) before.focus();
  if (props.once) {
    writeStore(props.once, "1");
  }
  emit("finish");
}

onMounted(() => {
  let seen = false;
  if (props.once) {
    seen = readStore(props.once) === "1";
  }
  if (seen) return;
  if (reducedMotion()) return emit("finish");
  show.value = true;
  before = document.activeElement as HTMLElement | null;
  // a modal dialog takes focus: onto Skip, so Enter or Esc leaves at once
  nextTick(() => skip.value?.focus());
  if (props.duration > 0) timer = setTimeout(dismiss, props.duration);
});

defineExpose({ dismiss });
</script>

<template>
  <Transition name="bless-splash">
    <div
      v-if="show"
      class="bless-splash"
      role="dialog"
      aria-modal="true"
      :aria-label="label"
      @keydown.esc.prevent="dismiss"
    >
      <div class="bless-splash__content"><slot :dismiss /></div>
      <button ref="skip" type="button" class="bless-splash__skip" @click="dismiss">
        {{ text.skip }}
      </button>
    </div>
  </Transition>
</template>

<style>
.bless-splash {
  position: fixed;
  inset: 0;
  z-index: var(--bless-z-modal);
  display: grid;
  place-items: center;
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-splash__content {
  animation: bless-splash-in var(--bless-duration-slower) var(--bless-ease-out);
}
.bless-splash__skip {
  border-radius: var(--bless-radius-plate);
  position: absolute;
  inset-inline-end: var(--bless-space-4);
  bottom: var(--bless-space-4);
  padding: var(--bless-space-2) var(--bless-space-4);
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-splash__skip:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-splash__skip:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-splash-leave-active {
  transition: opacity var(--bless-duration-slower) var(--bless-ease-in-out);
}
.bless-splash-leave-to {
  opacity: 0;
}
@keyframes bless-splash-in {
  from {
    opacity: 0;
    transform: translateY(var(--bless-space-4));
  }
}
</style>
