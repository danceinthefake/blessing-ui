<script setup lang="ts">
defineOptions({ name: "BlessPresenceCursors" });

export interface BlessPresenceCursor {
  /** stable per person, for example the Presence key */
  id: string;
  name: string;
  /** 0 (start edge) to 1 (end edge) of the area */
  x: number;
  /** 0 (top) to 1 (bottom) of the area */
  y: number;
  /** a token name (`chart-2`, `accent`…) or any CSS color; default: one of the chart colors */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    /** the other people's pointers; leave out the local one */
    cursors: BlessPresenceCursor[];
    /** report the local pointer with `move` */
    track?: boolean;
  }>(),
  { track: true },
);
const emit = defineEmits<{
  /** the local pointer as fractions of the area, or null when it leaves */
  move: [at: { x: number; y: number } | null];
}>();

// the same person keeps the same color from one render to the next
const hash = (s: string) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const colorOf = (c: BlessPresenceCursor) =>
  !c.color
    ? `var(--bless-color-chart-${(hash(c.id) % 5) + 1})`
    : /^[a-z0-9-]+$/i.test(c.color)
      ? `var(--bless-color-${c.color})`
      : c.color;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

function onMove(e: PointerEvent) {
  if (!props.track) return;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (!r.width || !r.height) return;
  // x counts from the start edge, so a right-to-left page and a left-to-right page agree
  const rtl = getComputedStyle(e.currentTarget as HTMLElement).direction === "rtl";
  const x = (e.clientX - r.left) / r.width;
  emit("move", { x: clamp(rtl ? 1 - x : x), y: clamp((e.clientY - r.top) / r.height) });
}
function onLeave() {
  if (props.track) emit("move", null);
}
</script>

<template>
  <div class="bless-presence" @pointermove="onMove" @pointerleave="onLeave">
    <slot />
    <!-- decoration over the content: say who is here in words elsewhere, for example with an avatar group -->
    <div class="bless-presence__layer" aria-hidden="true">
      <div
        v-for="c in cursors"
        :key="c.id"
        class="bless-presence__cursor"
        :style="{
          insetInlineStart: `${clamp(c.x) * 100}%`,
          insetBlockStart: `${clamp(c.y) * 100}%`,
          '--_c': colorOf(c),
        }"
      >
        <svg class="bless-presence__arrow" viewBox="0 0 16 16" width="16" height="16">
          <path d="M1 1l5.5 14 2-6 6-2z" />
        </svg>
        <span class="bless-presence__name">{{ c.name }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.bless-presence {
  position: relative;
}
.bless-presence__layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.bless-presence__cursor {
  position: absolute;
  display: flex;
  align-items: flex-start;
  gap: 2px;
  /* the tip of the arrow is the point */
  margin: -1px 0 0 -1px;
  transition:
    inset-inline-start var(--bless-duration-fast) var(--bless-ease-linear),
    inset-block-start var(--bless-duration-fast) var(--bless-ease-linear);
}
.bless-presence__arrow {
  flex: none;
  fill: var(--_c);
  stroke: var(--bless-color-bg);
  stroke-width: 1.5;
  paint-order: stroke;
}
[dir="rtl"] .bless-presence__arrow {
  transform: scaleX(-1);
}
.bless-presence__name {
  margin-block-start: 12px;
  padding: 1px var(--bless-space-1);
  border-inline-start: 3px solid var(--_c);
  background: var(--bless-color-surface-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
  white-space: nowrap;
}
@media (prefers-reduced-motion: reduce) {
  .bless-presence__cursor {
    transition: none;
  }
}
</style>
