<script setup lang="ts" generic="T">
import { computed, ref } from "vue";

defineOptions({ name: "BlessVirtualScroller" });

const props = withDefaults(
  defineProps<{
    items: T[];
    /** fixed row height in px */
    itemHeight: number;
    height?: string;
    /** rows rendered beyond the viewport on each side */
    overscan?: number;
    rowKey?: (item: T, index: number) => string | number;
    label?: string;
  }>(),
  { height: "320px", overscan: 4 },
);
// ponytail: fixed row height only; a measuring variant is a separate component if ever needed
const top = ref(0);
const vh = ref(0);
const viewport = ref<HTMLElement>();
const start = computed(() =>
  Math.max(0, Math.floor(top.value / props.itemHeight) - props.overscan),
);
const end = computed(() =>
  Math.min(
    props.items.length,
    Math.ceil((top.value + vh.value) / props.itemHeight) + props.overscan,
  ),
);
const slice = computed(() => props.items.slice(start.value, end.value));
function onScroll() {
  top.value = viewport.value!.scrollTop;
  vh.value = viewport.value!.clientHeight;
}
function scrollTo(index: number) {
  viewport.value?.scrollTo({ top: index * props.itemHeight });
}
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
    <div class="bless-virtual__spacer" :style="{ height: `${items.length * itemHeight}px` }">
      <div
        class="bless-virtual__window"
        :style="{ transform: `translateY(${start * itemHeight}px)` }"
      >
        <div
          v-for="(item, k) in slice"
          :key="rowKey ? rowKey(item, start + k) : start + k"
          class="bless-virtual__row"
          :style="{ height: `${itemHeight}px` }"
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
