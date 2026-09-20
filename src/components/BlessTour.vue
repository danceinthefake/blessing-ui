<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useFloating, type Placement } from "../composables/useFloating";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessTour" });

export interface BlessTourStep {
  /** CSS selector of the element to point at; omit for a centred step */
  target?: string;
  title?: string;
  text: string;
  placement?: Placement;
}

const props = withDefaults(
  defineProps<{
    steps: BlessTourStep[];
    labels?: Partial<{ next: string; prev: string; done: string; skip: string }>;
    /** dim the page and cut a hole around the target */
    spotlight?: boolean;
  }>(),
  { spotlight: true },
);
const open = defineModel<boolean>("open", { default: false });
const step = defineModel<number>("step", { default: 0 });
const emit = defineEmits<{ finish: []; skip: [] }>();

const L = computed(() => ({
  next: "Next",
  prev: "Back",
  done: "Done",
  skip: "Skip",
  ...props.labels,
}));
const cur = computed(() => props.steps[step.value]);
const last = computed(() => step.value >= props.steps.length - 1);
const anchor = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement>();
const rect = ref<DOMRect | null>(null);
const { x, y, side, update } = useFloating(anchor, panel, open, () => ({
  placement: cur.value?.placement ?? "bottom",
  offset: 12,
}));

function locate() {
  const el = cur.value?.target ? document.querySelector<HTMLElement>(cur.value.target) : null;
  anchor.value = el;
  rect.value = el?.getBoundingClientRect() ?? null;
  el?.scrollIntoView?.({ block: "center", behavior: "smooth" });
  nextTick(() => {
    update();
    rect.value = el?.getBoundingClientRect() ?? null;
    panel.value?.focus();
  });
}
watch([open, step], ([o]) => o && locate(), { immediate: true });
function close(finished: boolean) {
  open.value = false;
  if (finished) emit("finish");
  else emit("skip");
}
const hole = computed(() => {
  const r = rect.value;
  return r
    ? {
        top: `${r.top - 6}px`,
        left: `${r.left - 6}px`,
        width: `${r.width + 12}px`,
        height: `${r.height + 12}px`,
      }
    : undefined;
});
</script>

<template>
  <Teleport to="body">
    <template v-if="open && cur">
      <div
        v-if="spotlight"
        class="bless-tour__spot"
        :class="{ 'bless-tour__spot--none': !hole }"
        :style="hole"
        aria-hidden="true"
      />
      <div
        ref="panel"
        class="bless-tour"
        :class="[`bless-tour--${side}`, { 'bless-tour--centred': !anchor }]"
        role="dialog"
        aria-modal="false"
        :aria-label="cur.title ?? `Step ${step + 1}`"
        tabindex="-1"
        :style="anchor ? { left: `${x}px`, top: `${y}px` } : undefined"
        @keydown.esc="close(false)"
      >
        <span class="bless-tour__count">{{ step + 1 }} / {{ steps.length }}</span>
        <strong v-if="cur.title" class="bless-tour__title">{{ cur.title }}</strong>
        <p class="bless-tour__text">{{ cur.text }}</p>
        <div class="bless-tour__actions">
          <BlessButton size="sm" variant="ghost" @click="close(false)">{{ L.skip }}</BlessButton>
          <span style="flex: 1" />
          <BlessButton size="sm" variant="outline" :disabled="step === 0" @click="step--">{{
            L.prev
          }}</BlessButton>
          <BlessButton size="sm" color="accent" @click="last ? close(true) : step++">{{
            last ? L.done : L.next
          }}</BlessButton>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<style>
.bless-tour__spot {
  border-radius: var(--bless-radius);
  position: fixed;
  z-index: var(--bless-z-modal);
  box-shadow: 0 0 0 100vmax var(--bless-color-backdrop);
  outline: 2px solid var(--bless-color-accent);
  pointer-events: none;
  transition:
    top var(--bless-duration-slow) var(--bless-ease-out),
    left var(--bless-duration-slow) var(--bless-ease-out),
    width var(--bless-duration-slow) var(--bless-ease-out),
    height var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-tour__spot--none {
  inset: 0;
  outline: 0;
  box-shadow: none;
  background: var(--bless-color-backdrop);
}
.bless-tour {
  border-radius: var(--bless-radius);
  position: fixed;
  z-index: calc(var(--bless-z-modal) + 1);
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  width: min(320px, calc(100vw - 32px));
  padding: var(--bless-space-4);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  box-shadow: var(--bless-shadow-plate);
  outline: 0;
}
.bless-tour--centred {
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}
.bless-tour__count {
  font-size: var(--bless-text-2xs);
  letter-spacing: var(--bless-tracking-wider);
  color: var(--bless-color-text-muted);
}
.bless-tour__title {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-tour__text {
  margin: 0;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.bless-tour__actions {
  display: flex;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-2);
}
</style>
