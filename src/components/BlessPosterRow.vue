<template>
  <section class="bless-posters" :class="`is-${shape}`" :aria-labelledby="`${uid}-title`">
    <div class="bless-posters__head">
      <h3 :id="`${uid}-title`" class="bless-posters__title">{{ title }}</h3>
      <div class="bless-posters__nav">
        <button type="button" :aria-label="text.previous" :disabled="atStart" @click="page(-1)">
          ‹
        </button>
        <button type="button" :aria-label="text.next" :disabled="atEnd" @click="page(1)">›</button>
      </div>
    </div>
    <ul ref="track" class="bless-stagger bless-posters__track" @scroll.passive="measure">
      <li v-for="p in items" :key="p.id" class="bless-posters__item">
        <a class="bless-posters__link" :href="p.href">
          <span class="bless-posters__image"><img :src="p.image" alt="" loading="lazy" /></span>
          <span class="bless-posters__name">{{ p.title }}</span>{{ " "
          }}<span v-if="p.meta" class="bless-posters__meta">{{ p.meta }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessPosterRow" });
const pack = useLabelPack("BlessPosterRow");

export interface BlessPoster {
  id: string;
  title: string;
  image: string;
  href: string;
  /** a short line under the title, for example "2026 · 8 episodes" */
  meta?: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    items: BlessPoster[];
    /** the shape of the posters */
    shape?: "tall" | "wide" | "square";
    labels?: Partial<{ previous: string; next: string }>;
  }>(),
  { shape: "tall" },
);

const text = computed(() => ({
  previous: "Scroll back",
  next: "Scroll on",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const track = ref<HTMLElement>();
// the ends are known only in the browser; both buttons work until then
const atStart = ref(false);
const atEnd = ref(false);
function measure() {
  const el = track.value;
  if (!el) return;
  const x = Math.abs(el.scrollLeft);
  atStart.value = x < 2;
  atEnd.value = x + el.clientWidth >= el.scrollWidth - 2;
}
function page(d: 1 | -1) {
  const el = track.value;
  if (!el) return;
  const rtl = getComputedStyle(el).direction === "rtl" ? -1 : 1;
  el.scrollBy({
    left: d * rtl * el.clientWidth * 0.9,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}
let ro: ResizeObserver | undefined;
onMounted(() => {
  measure();
  if (typeof ResizeObserver === "function" && track.value) {
    ro = new ResizeObserver(measure);
    ro.observe(track.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<style>
.bless-posters {
  display: grid;
  gap: var(--bless-space-2);
  min-inline-size: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  --_w: 9rem;
  --_ratio: 2 / 3;
}
.bless-posters.is-wide {
  --_w: 15rem;
  --_ratio: 16 / 9;
}
.bless-posters.is-square {
  --_w: 10rem;
  --_ratio: 1;
}
.bless-posters__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-posters__title {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-posters__nav {
  display: flex;
  gap: var(--bless-space-1);
}
.bless-posters__nav button {
  inline-size: 2rem;
  block-size: 2rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
}
.bless-posters__nav button:disabled {
  opacity: 0.35;
  cursor: default;
}
.bless-posters__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(--_w);
  gap: var(--bless-space-3);
  margin: 0;
  padding: 3px 3px var(--bless-space-2);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  list-style: none;
}
.bless-posters__item {
  scroll-snap-align: start;
}
.bless-posters__link {
  display: grid;
  gap: 2px;
  color: inherit;
  text-decoration: none;
}
.bless-posters__image {
  display: block;
  aspect-ratio: var(--_ratio);
  overflow: hidden;
  background: var(--bless-color-surface-2);
}
.bless-posters__image img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
@media (prefers-reduced-motion: no-preference) {
  .bless-posters__image img {
    transition: transform var(--bless-duration-base) ease-out;
  }
  .bless-posters__link:hover .bless-posters__image img {
    transform: scale(1.04);
  }
}
.bless-posters__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-posters__name {
  margin-block-start: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
  line-height: var(--bless-leading-tight);
}
.bless-posters__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-posters__nav button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
