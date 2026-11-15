<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessReadingProgress" });
const pack = useLabelPack("BlessReadingProgress");

const props = withDefaults(
  defineProps<{
    /** the article: an element or a CSS selector. A box that scrolls by itself is read by its own scroll. Default: the page. */
    target?: HTMLElement | string;
    /** `fixed` sits at the top of the window; `sticky` sits at the top of the box it is in */
    position?: "fixed" | "sticky";
    /** show the minutes left at the end of the bar */
    minutes?: boolean;
    /** words a minute of a reader, for the minutes left */
    wpm?: number;
    labels?: Partial<{ label: string; left: (minutes: number) => string }>;
  }>(),
  { position: "fixed", wpm: 230 },
);
const emit = defineEmits<{ done: [] }>();

const text = computed(() => ({
  label: "Reading progress",
  left: (m: number) => (m < 1 ? "Less than a minute left" : `${m} min left`),
  ...pack(),
  ...props.labels,
}));

const progress = ref(0);
const words = ref(0);
let el: HTMLElement | undefined;
let own = false;
let frame = 0;
function read() {
  frame = 0;
  if (!el) return;
  let p: number;
  if (own) {
    p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
  } else {
    const r = el.getBoundingClientRect();
    p = -r.top / Math.max(1, r.height - window.innerHeight);
  }
  const next = Math.min(1, Math.max(0, p));
  if (next === 1 && progress.value < 1) emit("done");
  progress.value = next;
}
const onScroll = () => (frame ||= requestAnimationFrame(read));
function bind() {
  unbind();
  el =
    typeof props.target === "string"
      ? (document.querySelector<HTMLElement>(props.target) ?? undefined)
      : (props.target ?? document.documentElement);
  if (!el) return;
  const o = getComputedStyle(el).overflowY;
  own = el !== document.documentElement && (o === "auto" || o === "scroll");
  (own ? el : window).addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  words.value = (el.textContent ?? "").split(/\s+/).filter(Boolean).length;
  read();
}
function unbind() {
  if (el) (own ? el : window).removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  cancelAnimationFrame(frame);
  frame = 0;
}
onMounted(bind);
watch(() => props.target, bind);
onBeforeUnmount(unbind);

const left = computed(() => Math.round((words.value * (1 - progress.value)) / props.wpm));
const pct = computed(() => Math.round(progress.value * 100));
</script>

<template>
  <div class="bless-reading" :class="`bless-reading--${position}`">
    <div
      class="bless-reading__track"
      role="progressbar"
      :aria-label="text.label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="pct"
      :aria-valuetext="minutes ? `${pct}%, ${text.left(left)}` : undefined"
    >
      <span class="bless-reading__bar" :style="{ transform: `scaleX(${progress})` }" />
    </div>
    <span v-if="minutes" class="bless-reading__left" aria-hidden="true">{{ text.left(left) }}</span>
  </div>
</template>

<style>
.bless-reading {
  inset-block-start: 0;
  inset-inline: 0;
  z-index: var(--bless-z-nav);
  pointer-events: none;
}
.bless-reading--fixed {
  position: fixed;
}
.bless-reading--sticky {
  position: sticky;
}
.bless-reading__track {
  block-size: var(--bless-reading-height, 3px);
  background: var(--bless-color-surface-2);
}
.bless-reading__bar {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
  transform-origin: left;
}
[dir="rtl"] .bless-reading__bar {
  transform-origin: right;
}
.bless-reading__left {
  position: absolute;
  inset-block-start: calc(var(--bless-reading-height, 3px) + var(--bless-space-1));
  inset-inline-end: var(--bless-space-2);
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
</style>
