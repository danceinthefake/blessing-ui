<script setup lang="ts">
import { computed, ref } from "vue";
import BlessSpinner from "./BlessSpinner.vue";
import { usePan } from "../composables/useGesture";

defineOptions({ name: "BlessPullToRefresh" });

const props = withDefaults(
  defineProps<{
    /** px of pull that triggers a refresh */
    threshold?: number;
    /** max visual travel */
    max?: number;
    disabled?: boolean;
    /** scroll container to check; default = the wrapper itself, falling back to window */
    scrollTarget?: HTMLElement | null;
    label?: string;
  }>(),
  { threshold: 64, max: 96, label: "Pull to refresh" },
);
const emit = defineEmits<{ refresh: [done: () => void] }>();
const root = ref<HTMLElement>();
const pull = ref(0);
const busy = ref(false);
let armed = false;

const atTop = () => {
  const t = props.scrollTarget ?? root.value;
  return (t && t.scrollHeight > t.clientHeight ? t.scrollTop : window.scrollY) <= 0;
};
usePan(root, (e) => {
  if (props.disabled || busy.value) return;
  if (e.phase === "start") armed = atTop();
  else if (e.phase === "move") {
    if (!armed || e.dy <= 0) return void (pull.value = 0);
    pull.value = Math.min(props.max, e.dy * 0.5); // dampen
    if (pull.value > 8) e.event.preventDefault();
  } else {
    if (armed && pull.value >= props.threshold) {
      busy.value = true;
      pull.value = props.threshold * 0.75;
      emit("refresh", () => ((busy.value = false), (pull.value = 0)));
    } else pull.value = 0;
    armed = false;
  }
});
const ready = computed(() => pull.value >= props.threshold);
</script>

<template>
  <div
    ref="root"
    class="bless-ptr"
    :class="{ 'bless-ptr--busy': busy }"
    :style="{ '--_p': `${pull}px` }"
  >
    <div
      class="bless-ptr__indicator"
      :class="{ 'bless-ptr__indicator--ready': ready }"
      role="status"
      :aria-label="busy ? 'Refreshing' : label"
      aria-live="polite"
    >
      <slot name="indicator" :ready :busy :pull>
        <BlessSpinner v-if="busy" size="sm" label="" />
        <span v-else class="bless-ptr__arrow" aria-hidden="true">↓</span>
      </slot>
    </div>
    <div class="bless-ptr__content"><slot /></div>
  </div>
</template>

<style>
.bless-ptr {
  position: relative;
  overflow: hidden;
  touch-action: pan-x pan-down; /* let vertical pull through when at top; browser handles the rest */
}
.bless-ptr__indicator {
  border-radius: var(--bless-radius-petal);
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  display: grid;
  place-items: center;
  height: var(--_p);
  color: var(--bless-color-text-muted);
  overflow: hidden;
}
.bless-ptr__arrow {
  display: inline-block;
  transition: transform var(--bless-duration-base) var(--bless-ease-out);
}
.bless-ptr__indicator--ready {
  color: var(--bless-color-accent-text);
}
.bless-ptr__indicator--ready .bless-ptr__arrow {
  transform: rotate(180deg);
}
.bless-ptr__content {
  transform: translateY(var(--_p));
  transition: transform var(--bless-duration-base) var(--bless-ease-out);
}
</style>
