<script setup lang="ts" generic="T">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

defineOptions({ name: "BlessVirtualScroller" });

const props = withDefaults(
  defineProps<{
    items: T[];
    /** row height in px — exact when `dynamic` is off, an estimate for unmeasured rows when it's on */
    itemHeight: number;
    /** measure each rendered row (ResizeObserver) and lay out by real heights */
    dynamic?: boolean;
    height?: string;
    /** rows rendered beyond the viewport on each side */
    overscan?: number;
    rowKey?: (item: T, index: number) => string | number;
    label?: string;
  }>(),
  { height: "320px", overscan: 4, dynamic: false },
);
const top = ref(0);
const vh = ref(0);
const viewport = ref<HTMLElement>();

// dynamic mode: measured heights by index; offsets[i] = top of row i (prefix sums, rebuilt lazily)
const heights = ref<number[]>([]);
const bump = ref(0); // version counter to recompute offsets after measurements
const offsets = computed(() => {
  void bump.value;
  const n = props.items.length;
  const out = new Array<number>(n + 1);
  out[0] = 0;
  for (let i = 0; i < n; i++)
    out[i + 1] =
      out[i] + (props.dynamic ? (heights.value[i] ?? props.itemHeight) : props.itemHeight);
  return out;
});
const total = computed(() =>
  props.dynamic ? offsets.value[props.items.length] : props.items.length * props.itemHeight,
);
function indexAt(y: number) {
  if (!props.dynamic) return Math.floor(y / props.itemHeight);
  const o = offsets.value;
  let lo = 0,
    hi = props.items.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (o[mid] <= y) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
const start = computed(() => Math.max(0, indexAt(top.value) - props.overscan));
const end = computed(() =>
  Math.min(props.items.length, indexAt(top.value + vh.value) + 1 + props.overscan),
);
const slice = computed(() => props.items.slice(start.value, end.value));
const offsetTop = computed(() =>
  props.dynamic ? offsets.value[start.value] : start.value * props.itemHeight,
);

function onScroll() {
  top.value = viewport.value!.scrollTop;
  vh.value = viewport.value!.clientHeight;
}
function scrollTo(index: number) {
  viewport.value?.scrollTo({
    top: props.dynamic ? offsets.value[index] : index * props.itemHeight,
  });
}

// measure rendered rows in dynamic mode
let ro: ResizeObserver | undefined;
function measure(el: Element) {
  const i = Number((el as HTMLElement).dataset.index);
  const h = (el as HTMLElement).offsetHeight;
  if (Number.isFinite(i) && h && heights.value[i] !== h) {
    heights.value[i] = h;
    bump.value++;
  }
}
const rowRef = (el: unknown) => {
  if (el instanceof HTMLElement) ro ? ro.observe(el) : measure(el);
};
onMounted(() => {
  if (props.dynamic && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver((entries) => entries.forEach((e) => measure(e.target)));
    viewport.value?.querySelectorAll(".bless-virtual__row").forEach((el) => ro!.observe(el));
  }
});
onBeforeUnmount(() => ro?.disconnect());
watch(
  () => props.items.length,
  () => ((heights.value.length = 0), bump.value++),
);
defineExpose({ scrollTo });
</script>

<template>
  <div
    ref="viewport"
    class="bless-virtual"
    :style="{ '--_h': height }"
    role="list"
    :aria-label="label"
    tabindex="0"
    @scroll.passive="onScroll"
    @vue:mounted="onScroll"
  >
    <div class="bless-virtual__spacer" :style="{ height: `${total}px` }">
      <div class="bless-virtual__window" :style="{ transform: `translateY(${offsetTop}px)` }">
        <div
          v-for="(item, k) in slice"
          :key="rowKey ? rowKey(item, start + k) : start + k"
          :ref="rowRef"
          :data-index="start + k"
          class="bless-virtual__row"
          :style="dynamic ? undefined : { height: `${itemHeight}px` }"
          role="listitem"
        >
          <slot :item :index="start + k" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bless-virtual {
  height: var(--_h);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--bless-color-text-muted) transparent;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-virtual:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-virtual__spacer {
  position: relative;
}
.bless-virtual__window {
  position: absolute;
  inset: 0 0 auto;
  will-change: transform;
}
.bless-virtual__row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 var(--bless-space-3);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
