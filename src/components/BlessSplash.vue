<script setup lang="ts">
import { onMounted, ref } from "vue";

defineOptions({ name: "BlessSplash" });

const props = withDefaults(
  defineProps<{
    /** localStorage key; splash shows once per key. Omit to show every load */
    once?: string;
    /** auto-dismiss after ms; 0 = manual only */
    duration?: number;
    skipLabel?: string;
  }>(),
  { duration: 2500, skipLabel: "Skip" },
);

const emit = defineEmits<{ done: [] }>();
const show = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function dismiss() {
  if (!show.value) return;
  clearTimeout(timer);
  show.value = false;
  if (props.once) {
    try {
      localStorage.setItem(props.once, "1");
    } catch {}
  }
  emit("done");
}

onMounted(() => {
  let seen = false;
  if (props.once) {
    try {
      seen = localStorage.getItem(props.once) === "1";
    } catch {}
  }
  if (seen) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return emit("done");
  show.value = true;
  if (props.duration > 0) timer = setTimeout(dismiss, props.duration);
});

defineExpose({ dismiss });
</script>

<template>
  <Transition name="bless-splash">
    <div v-if="show" class="bless-splash" role="dialog" aria-modal="true" @keydown.esc="dismiss">
      <div class="bless-splash__content"><slot :dismiss /></div>
      <button type="button" class="bless-splash__skip" @click="dismiss">{{ skipLabel }}</button>
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
  position: absolute;
  right: var(--bless-space-4);
  bottom: var(--bless-space-4);
  padding: var(--bless-space-2) var(--bless-space-4);
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
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
