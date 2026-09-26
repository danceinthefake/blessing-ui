<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { logicalKey } from "../composables/rtl";
import { reducedMotion, scrollBehavior } from "../composables/useMedia";

defineOptions({ name: "BlessCarousel" });

const props = withDefaults(
  defineProps<{
    /** slides per view; fractional ok (1.2 = peek) */
    perView?: number;
    gap?: string;
    loop?: boolean;
    /** ms; 0 = off */
    autoplay?: number;
    dots?: boolean;
    arrows?: boolean;
    label?: string;
    prevLabel?: string;
    nextLabel?: string;
  }>(),
  {
    perView: 1,
    gap: "var(--bless-space-3)",
    loop: false,
    autoplay: 0,
    dots: true,
    arrows: true,
    label: "Carousel",
    prevLabel: "Previous slide",
    nextLabel: "Next slide",
  },
);

const index = defineModel<number>({ default: 0 });
const track = ref<HTMLElement>();
const count = ref(0);
let ro: ResizeObserver | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let syncing = false;

const pages = computed(() => Math.max(1, Math.ceil(count.value - props.perView + 1)));
const canPrev = computed(() => props.loop || index.value > 0);
const canNext = computed(() => props.loop || index.value < pages.value - 1);

function slideWidth() {
  const el = track.value;
  if (!el) return 0;
  const first = el.firstElementChild as HTMLElement | null;
  return first
    ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0")
    : el.clientWidth;
}
// in RTL the scroll origin is the inline start (right edge) and scrollLeft runs negative
const dir = () => (track.value && getComputedStyle(track.value).direction === "rtl" ? -1 : 1);
function go(i: number, smooth = true) {
  const n = pages.value;
  const next = props.loop ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i));
  index.value = next;
  syncing = true;
  track.value?.scrollTo({
    left: dir() * next * slideWidth(),
    behavior: smooth ? scrollBehavior() : "auto",
  });
  setTimeout(() => (syncing = false), 400);
}
function onScroll() {
  if (syncing || !track.value) return;
  const i = Math.round(Math.abs(track.value.scrollLeft) / (slideWidth() || 1));
  if (i !== index.value) index.value = i;
}
function count_() {
  count.value = track.value?.children.length ?? 0;
}
function onKey(e: KeyboardEvent) {
  if (logicalKey(e) === "ArrowLeft") {
    e.preventDefault();
    go(index.value - 1);
  }
  if (logicalKey(e) === "ArrowRight") {
    e.preventDefault();
    go(index.value + 1);
  }
}
let mo: MutationObserver | undefined;
function play() {
  stop();
  if (props.autoplay > 0 && !reducedMotion())
    timer = setInterval(() => go(index.value + 1), props.autoplay);
}
function stop() {
  clearInterval(timer);
}
onMounted(() => {
  count_();
  ro = new ResizeObserver(() => go(index.value, false));
  if (track.value) ro.observe(track.value);
  mo = new MutationObserver(count_);
  mo.observe(track.value!, { childList: true });
  play();
});
onBeforeUnmount(() => {
  stop();
  ro?.disconnect();
  mo?.disconnect();
});
watch(() => props.autoplay, play);
defineExpose({ go, next: () => go(index.value + 1), prev: () => go(index.value - 1) });
</script>

<template>
  <div
    class="bless-carousel"
    role="region"
    :aria-label="label"
    aria-roledescription="carousel"
    tabindex="0"
    @keydown="onKey"
    @mouseenter="stop"
    @mouseleave="play"
    @focusin="stop"
    @focusout="play"
  >
    <div
      ref="track"
      class="bless-carousel__track"
      tabindex="0"
      :style="{ '--_pv': perView, '--_gap': gap }"
      @scroll.passive="onScroll"
    >
      <slot />
    </div>
    <template v-if="arrows && count > perView">
      <button
        type="button"
        class="bless-carousel__arrow bless-carousel__arrow--prev"
        :aria-label="prevLabel"
        :disabled="!canPrev"
        @click="go(index - 1)"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        class="bless-carousel__arrow bless-carousel__arrow--next"
        :aria-label="nextLabel"
        :disabled="!canNext"
        @click="go(index + 1)"
      >
        <span aria-hidden="true">›</span>
      </button>
    </template>
    <div v-if="dots && pages > 1" class="bless-carousel__dots" role="tablist" aria-label="Slides">
      <button
        v-for="p in pages"
        :key="p"
        type="button"
        role="tab"
        class="bless-carousel__dot"
        :class="{ 'bless-carousel__dot--active': p - 1 === index }"
        :aria-selected="p - 1 === index"
        :aria-label="`Slide ${p}`"
        @click="go(p - 1)"
      />
    </div>
  </div>
</template>

<style>
.bless-carousel {
  position: relative;
  outline: 0;
}
.bless-carousel:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 4px;
}
.bless-carousel__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - (var(--_pv) - 1) * var(--_gap)) / var(--_pv));
  column-gap: var(--_gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}
.bless-carousel__track::-webkit-scrollbar {
  display: none;
}
.bless-carousel__track > * {
  scroll-snap-align: start;
  min-width: 0;
}
.bless-carousel__arrow {
  border-radius: var(--bless-radius);
  position: absolute;
  top: 50%;
  width: 40px;
  height: 48px;
  padding: 0;
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: var(--bless-text-xl);
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%) skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-carousel__arrow > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
/* prev sits at the inline start, so in RTL its arrow points right */
[dir="rtl"] .bless-carousel__arrow > span {
  transform: skewX(var(--bless-skew-counter)) scaleX(-1);
}
.bless-carousel__arrow--prev {
  inset-inline-start: var(--bless-space-2);
}
.bless-carousel__arrow--next {
  inset-inline-end: var(--bless-space-2);
}
.bless-carousel__arrow:hover:not(:disabled) {
  opacity: var(--bless-hover-opacity);
}
.bless-carousel__arrow:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}
.bless-carousel__arrow:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-carousel__dots {
  display: flex;
  justify-content: center;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-3);
}
.bless-carousel__dot {
  width: 18px;
  height: 4px;
  padding: 0;
  border: 0;
  background: var(--bless-color-border);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    background var(--bless-duration-base),
    var(--bless-lean-transition);
}
.bless-carousel__dot--active {
  background: var(--bless-color-accent);
}
.bless-carousel__dot:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
