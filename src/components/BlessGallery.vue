<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { logicalKey } from "../composables/rtl";
import BlessModal from "./BlessModal.vue";

defineOptions({ name: "BlessGallery" });

export interface BlessGalleryItem {
  src: string;
  thumb?: string;
  alt?: string;
  caption?: string;
}

const props = withDefaults(
  defineProps<{
    items: BlessGalleryItem[];
    /** thumbnail grid column min width */
    columns?: string;
    loop?: boolean;
    prevLabel?: string;
    nextLabel?: string;
  }>(),
  { columns: "160px", loop: true, prevLabel: "Previous", nextLabel: "Next" },
);

/** index of open item, -1 = closed */
const index = defineModel<number>({ default: -1 });
const open = ref(false);
const current = computed(() => props.items[index.value]);
const hasPrev = computed(() => props.loop || index.value > 0);
const hasNext = computed(() => props.loop || index.value < props.items.length - 1);

watch(index, (i) => (open.value = i >= 0), { immediate: true });
watch(open, (o) => {
  if (!o) index.value = -1;
});

function step(d: 1 | -1) {
  const n = props.items.length;
  if (!n) return;
  const next = index.value + d;
  index.value = props.loop ? (next + n) % n : Math.min(n - 1, Math.max(0, next));
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  if (logicalKey(e) === "ArrowRight") step(1);
  else if (logicalKey(e) === "ArrowLeft") step(-1);
  else return;
  e.preventDefault();
}
</script>

<template>
  <div class="bless-gallery" @keydown="onKey">
    <ul class="bless-gallery__grid" :style="{ '--_col': columns }">
      <li v-for="(item, i) in items" :key="item.src" class="bless-gallery__cell">
        <button type="button" class="bless-gallery__thumb" @click="index = i">
          <slot name="thumb" :item :index="i">
            <img :src="item.thumb ?? item.src" :alt="item.alt ?? ''" loading="lazy" />
          </slot>
        </button>
      </li>
    </ul>

    <BlessModal v-model="open" size="lg" class="bless-gallery__modal">
      <div v-if="current" class="bless-gallery__viewer">
        <figure class="bless-gallery__figure">
          <img :src="current.src" :alt="current.alt ?? ''" class="bless-gallery__image" />
          <figcaption v-if="current.caption" class="bless-gallery__caption">
            {{ current.caption }}
          </figcaption>
        </figure>
        <button
          v-if="items.length > 1"
          type="button"
          class="bless-gallery__nav bless-gallery__nav--prev"
          :aria-label="prevLabel"
          :disabled="!hasPrev"
          @click="step(-1)"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          v-if="items.length > 1"
          type="button"
          class="bless-gallery__nav bless-gallery__nav--next"
          :aria-label="nextLabel"
          :disabled="!hasNext"
          @click="step(1)"
        >
          <span aria-hidden="true">›</span>
        </button>
        <span class="bless-gallery__count" aria-live="polite"
          >{{ index + 1 }} / {{ items.length }}</span
        >
      </div>
    </BlessModal>
  </div>
</template>

<style>
.bless-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--_col), 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-gallery__thumb {
  border-radius: var(--bless-radius);
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: var(--bless-color-surface);
  line-height: 0;
  cursor: pointer;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-gallery__thumb:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-gallery__thumb:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-gallery__thumb img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.bless-gallery__modal .bless-modal__panel {
  background: var(--bless-color-media-bg);
  color: #fff;
}
.bless-gallery__modal .bless-modal__body {
  padding: 0;
}
.bless-gallery__viewer {
  position: relative;
  outline: 0;
}
.bless-gallery__figure {
  margin: 0;
}
.bless-gallery__image {
  display: block;
  width: 100%;
  max-height: calc(100dvh - 2 * var(--bless-space-4) - 3rem);
  object-fit: contain;
}
.bless-gallery__caption {
  padding: var(--bless-space-3) var(--bless-space-16) var(--bless-space-3) var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  letter-spacing: var(--bless-tracking-normal);
}
.bless-gallery__nav {
  position: absolute;
  top: 50%;
  width: 44px;
  height: 56px;
  padding: 0;
  border: 0;
  background: rgb(0 0 0 / 0.5);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xl);
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%) skewX(var(--bless-skew));
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-gallery__nav > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-gallery__nav--prev {
  inset-inline-start: var(--bless-space-2);
}
.bless-gallery__nav--next {
  inset-inline-end: var(--bless-space-2);
}
.bless-gallery__nav:hover:not(:disabled) {
  opacity: var(--bless-hover-opacity);
}
.bless-gallery__nav:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}
.bless-gallery__nav:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-gallery__count {
  position: absolute;
  inset-inline-end: var(--bless-space-4);
  bottom: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
</style>
