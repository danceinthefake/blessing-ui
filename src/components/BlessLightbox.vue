<template>
  <!-- the keys work from any control in the modal, the close button too -->
  <div class="bless-lightbox__root" @keydown="onKey">
    <BlessModal
      v-model="open"
      size="lg"
      class="bless-lightbox"
      :aria-label="current ? nameOf(current, index) : undefined"
    >
      <div v-if="current" class="bless-lightbox__viewer">
        <figure class="bless-lightbox__figure">
          <div
            class="bless-lightbox__stage"
            :class="{ 'bless-lightbox__stage--zoomed': zoomed }"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointercancel="onUp"
            @dblclick="toggleZoom"
          >
            <img
              :src="current.src"
              :alt="current.alt ?? ''"
              class="bless-lightbox__image"
              draggable="false"
              :style="
                zoomed
                  ? { transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }
                  : undefined
              "
            />
          </div>
          <figcaption v-if="current.caption" class="bless-lightbox__caption">
            {{ current.caption }}
          </figcaption>
        </figure>
        <button
          v-if="items.length > 1"
          type="button"
          class="bless-lightbox__nav bless-lightbox__nav--prev"
          :aria-label="text.prev"
          :aria-disabled="!hasPrev || undefined"
          @click="step(-1)"
        >
          <BlessIcon name="chevron-left" size="md" />
        </button>
        <button
          v-if="items.length > 1"
          type="button"
          class="bless-lightbox__nav bless-lightbox__nav--next"
          :aria-label="text.next"
          :aria-disabled="!hasNext || undefined"
          @click="step(1)"
        >
          <BlessIcon name="chevron-right" size="md" />
        </button>
        <div class="bless-lightbox__bar">
          <button
            type="button"
            class="bless-lightbox__zoom"
            :aria-pressed="zoomed"
            :aria-label="zoomed ? text.zoomOut : text.zoomIn"
            @click="toggleZoom"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path
                :d="zoomed ? 'M5 7h4M10.5 10.5 14 14' : 'M5 7h4M7 5v4M10.5 10.5 14 14'"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <span class="bless-lightbox__count" aria-live="polite"
            >{{ index + 1 }} / {{ items.length }}</span
          >
        </div>
      </div>
    </BlessModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { logicalKey } from "../composables/rtl";
import { useLabelPack } from "../composables/useLabels";
import BlessIcon from "./BlessIcon.vue";
import BlessModal from "./BlessModal.vue";

defineOptions({ name: "BlessLightbox" });
const pack = useLabelPack("BlessLightbox");

export interface BlessLightboxItem {
  src: string;
  /** a small copy for a grid; the lightbox shows `src` */
  thumb?: string;
  alt?: string;
  caption?: string;
}

const props = withDefaults(
  defineProps<{
    items: BlessLightboxItem[];
    /** after the last image comes the first */
    loop?: boolean;
    /** how much the zoom enlarges the image */
    zoom?: number;
    labels?: Partial<{
      prev: string;
      next: string;
      zoomIn: string;
      zoomOut: string;
      /** the name of an image with no alt text and no caption */
      image: (n: number, of: number) => string;
    }>;
  }>(),
  { loop: true, zoom: 2 },
);

const text = computed(() => ({
  prev: "Previous",
  next: "Next",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  image: (n: number, of: number) => `Image ${n} of ${of}`,
  ...pack(),
  ...props.labels,
}));

/** the index of the open image; -1 is closed */
const index = defineModel<number>({ default: -1 });
const open = ref(false);
const current = computed(() => props.items[index.value]);
const hasPrev = computed(() => props.loop || index.value > 0);
const hasNext = computed(() => props.loop || index.value < props.items.length - 1);
const nameOf = (item: BlessLightboxItem, i: number) =>
  item.alt || item.caption || text.value.image(i + 1, props.items.length);

watch(index, (i) => (open.value = i >= 0), { immediate: true });
watch(open, (o) => {
  if (!o) index.value = -1;
});

// the zoom: a scale, and a pan in pixels of the shown image
const zoomed = ref(false);
const pan = ref({ x: 0, y: 0 });
const unzoom = () => {
  zoomed.value = false;
  pan.value = { x: 0, y: 0 };
};
watch(index, unzoom);

function step(d: 1 | -1) {
  const n = props.items.length;
  if (!n || (d < 0 ? !hasPrev.value : !hasNext.value)) return;
  index.value = (index.value + d + n) % n;
}
function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  if (logicalKey(e) === "ArrowRight") step(1);
  else if (logicalKey(e) === "ArrowLeft") step(-1);
  else return;
  e.preventDefault();
}

// a drag pans a zoomed image; a fast drag to the side on a plain image goes to the next one
let down: { x: number; y: number; pan: { x: number; y: number } } | undefined;
function onDown(e: PointerEvent) {
  if (e.button !== 0) return;
  down = { x: e.clientX, y: e.clientY, pan: { ...pan.value } };
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onMove(e: PointerEvent) {
  if (!down || !zoomed.value) return;
  pan.value = { x: down.pan.x + e.clientX - down.x, y: down.pan.y + e.clientY - down.y };
}
function onUp(e: PointerEvent) {
  if (!down) return;
  const dx = e.clientX - down.x;
  const dy = e.clientY - down.y;
  down = undefined;
  if (zoomed.value || Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
  // to the start edge is the next image: left in a left-to-right page, right in a right-to-left one
  const rtl = getComputedStyle(e.currentTarget as HTMLElement).direction === "rtl";
  step(dx < 0 !== rtl ? 1 : -1);
}
function toggleZoom() {
  if (zoomed.value) unzoom();
  else zoomed.value = true;
}
</script>

<style>
.bless-lightbox__root {
  display: contents;
}
.bless-lightbox .bless-modal__panel {
  background: var(--bless-color-media-bg);
  color: #fff;
}
.bless-lightbox .bless-modal__body {
  padding: 0;
}
.bless-lightbox__viewer {
  position: relative;
  outline: 0;
}
.bless-lightbox__figure {
  margin: 0;
}
.bless-lightbox__stage {
  overflow: hidden;
  touch-action: pinch-zoom;
  cursor: zoom-in;
}
.bless-lightbox__stage--zoomed {
  touch-action: none;
  cursor: grab;
}
.bless-lightbox__stage--zoomed:active {
  cursor: grabbing;
}
.bless-lightbox__image {
  display: block;
  width: 100%;
  max-height: calc(100dvh - 2 * var(--bless-space-4) - 3rem);
  object-fit: contain;
  user-select: none;
  transition: transform var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-lightbox__stage--zoomed:active .bless-lightbox__image {
  transition: none;
}
.bless-lightbox__caption {
  padding: var(--bless-space-3) var(--bless-space-4);
  padding-inline-end: calc(var(--bless-space-16) + 2rem);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  letter-spacing: var(--bless-tracking-normal);
}
.bless-lightbox__nav {
  position: absolute;
  top: 50%;
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 56px;
  padding: 0;
  border: 0;
  border-radius: var(--bless-radius);
  background: rgb(0 0 0 / 0.5);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xl);
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%) skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-lightbox__nav > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
/* prev sits at the inline start, so in RTL its arrow points right */
[dir="rtl"] .bless-lightbox__nav > span {
  transform: skewX(var(--bless-skew-counter)) scaleX(-1);
}
.bless-lightbox__nav--prev {
  inset-inline-start: var(--bless-space-2);
}
.bless-lightbox__nav--next {
  inset-inline-end: var(--bless-space-2);
}
.bless-lightbox__nav:hover:not([aria-disabled]) {
  background: var(--bless-color-surface-2);
  color: var(--bless-color-text);
}
/* aria-disabled, not disabled: the focused arrow keeps focus at the last image */
.bless-lightbox__nav[aria-disabled] {
  opacity: 0.2;
  cursor: not-allowed;
}
.bless-lightbox__bar {
  position: absolute;
  inset-inline-end: var(--bless-space-4);
  bottom: var(--bless-space-3);
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-lightbox__zoom {
  display: inline-grid;
  place-items: center;
  inline-size: 28px;
  block-size: 28px;
  padding: 0;
  border: 0;
  background: rgb(0 0 0 / 0.5);
  color: #fff;
  cursor: pointer;
}
.bless-lightbox__nav:focus-visible,
.bless-lightbox__zoom:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-lightbox__count {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
@media (prefers-reduced-motion: reduce) {
  .bless-lightbox__image,
  .bless-lightbox__nav {
    transition: none;
  }
}
</style>
