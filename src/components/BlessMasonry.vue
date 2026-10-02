<script setup lang="ts" generic="T">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

defineOptions({ name: "BlessMasonry" });

const props = withDefaults(
  defineProps<{
    items: T[];
    rowKey?: (item: T, index: number) => string | number;
    /** a fixed number of columns; leave out to fit as many as `minWidth` allows */
    columns?: number;
    /** narrowest a column may get, in px, when `columns` is not set */
    minWidth?: number;
    /** space between cards, in px */
    gap?: number;
    label?: string;
  }>(),
  { minWidth: 240, gap: 16 },
);

const root = ref<HTMLElement>();
const cells = ref<HTMLElement[]>([]);
const ready = ref(false);
const colWidth = ref(0);
const pos = ref<{ left: number; top: number }[]>([]);
const height = ref(0);
const rtl = ref(false);
/** slide cards only after the first layout, so they do not fly in from the corner */
const animate = ref(false);

const setCell = (el: unknown, i: number) => {
  if (el) cells.value[i] = el as HTMLElement;
};

/** step 1: how many columns and how wide, which sets every card's width */
function size() {
  const el = root.value;
  if (!el) return;
  const W = el.clientWidth;
  const n =
    props.columns ?? Math.max(1, Math.floor((W + props.gap) / (props.minWidth + props.gap)));
  colWidth.value = (W - props.gap * (n - 1)) / n;
  nextTick(place);
}
/** step 2: with widths set, drop each card, in order, into the shortest column */
function place() {
  const el = root.value;
  if (!el || !colWidth.value) return;
  rtl.value = getComputedStyle(el).direction === "rtl";
  const W = el.clientWidth;
  const n = Math.max(1, Math.round((W + props.gap) / (colWidth.value + props.gap)));
  const tops = Array<number>(n).fill(0);
  pos.value = props.items.map((_, i) => {
    const c = tops.indexOf(Math.min(...tops));
    const at = { left: c * (colWidth.value + props.gap), top: tops[c]! };
    tops[c] = at.top + (cells.value[i]?.offsetHeight ?? 0) + props.gap;
    return at;
  });
  height.value = Math.max(0, Math.max(...tops) - props.gap);
  ready.value = true;
  requestAnimationFrame(() => (animate.value = true));
}

let ro: ResizeObserver | undefined;
let seen = new Set<Element>();
function watchCells() {
  if (!ro) return;
  for (const c of cells.value) if (c && !seen.has(c)) (ro.observe(c), seen.add(c));
}
onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver((entries) => {
      // the container changing width means new columns; a card changing height only moves the rest
      entries.some((e) => e.target === root.value) ? size() : place();
    });
    root.value && ro.observe(root.value);
  }
  size();
  nextTick(watchCells);
});
onBeforeUnmount(() => ro?.disconnect());
watch(
  () => [props.items, props.columns, props.minWidth, props.gap],
  () =>
    nextTick(() => {
      cells.value.length = props.items.length;
      seen = new Set([...seen].filter((e) => e.isConnected));
      watchCells();
      size();
    }),
);
</script>

<template>
  <div
    ref="root"
    class="bless-masonry"
    :class="{ 'bless-masonry--ready': ready, 'bless-masonry--animate': animate }"
    role="list"
    :aria-label="label"
    :style="ready ? { height: `${height}px` } : { '--bless-masonry-gap': `${gap}px` }"
  >
    <div
      v-for="(item, i) in items"
      :key="rowKey ? rowKey(item, i) : i"
      :ref="(el) => setCell(el, i)"
      class="bless-masonry__cell"
      role="listitem"
      :style="
        colWidth
          ? {
              width: `${colWidth}px`,
              ...(ready && {
                transform: `translate(${(rtl ? -1 : 1) * (pos[i]?.left ?? 0)}px, ${pos[i]?.top ?? 0}px)`,
              }),
            }
          : undefined
      "
    >
      <slot :item :index="i">{{ item }}</slot>
    </div>
  </div>
</template>

<style>
.bless-masonry {
  position: relative;
  display: grid;
  gap: var(--bless-masonry-gap, 16px);
  min-width: 0;
}
.bless-masonry--ready {
  display: block;
}
.bless-masonry--ready > .bless-masonry__cell {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
}
.bless-masonry--animate > .bless-masonry__cell {
  transition: transform var(--bless-duration-slow) var(--bless-ease-out);
}
[dir="rtl"] .bless-masonry--ready > .bless-masonry__cell {
  inset-inline-start: auto;
  inset-inline-end: 0;
}
@media (prefers-reduced-motion: reduce) {
  .bless-masonry--animate > .bless-masonry__cell {
    transition: none;
  }
}
</style>
