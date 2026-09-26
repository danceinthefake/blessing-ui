<script setup lang="ts">
import { ref } from "vue";
import {
  BlessButton,
  BlessText,
  useLongPress,
  usePan,
  useSwipe,
  useTouchRepeat,
} from "blessing-ui";

// pan: drag the plate around — and, never the only way, move it with the arrow keys
const pan = ref<HTMLElement>();
const pos = ref({ x: 0, y: 0 });
const dragging = ref(false);
let from = { x: 0, y: 0 };
usePan(pan, ({ dx, dy, phase }) => {
  if (phase === "start") ((from = { ...pos.value }), (dragging.value = true));
  if (phase === "move") pos.value = { x: from.x + dx, y: from.y + dy };
  if (phase === "end" || phase === "cancel") dragging.value = false;
});
const keys: Record<string, [number, number]> = {
  ArrowLeft: [-8, 0],
  ArrowRight: [8, 0],
  ArrowUp: [0, -8],
  ArrowDown: [0, 8],
};
function nudge(e: KeyboardEvent) {
  const d = keys[e.key];
  if (!d) return;
  e.preventDefault();
  pos.value = { x: pos.value.x + d[0], y: pos.value.y + d[1] };
}

// swipe: fires once on release
const strip = ref<HTMLElement>();
const { direction } = useSwipe(strip, () => {}, { threshold: 40, axis: "x" });

// long press: hold 500ms without moving
const hold = ref<HTMLElement>();
const held = ref(0);
const { pressing } = useLongPress(hold, () => held.value++, { ms: 500 });

// touch repeat: ± steppers
const plus = ref<HTMLElement>();
const minus = ref<HTMLElement>();
const count = ref(0);
useTouchRepeat(plus, () => count.value++);
useTouchRepeat(minus, () => count.value--);
</script>

<template>
  <div class="g">
    <div class="g__row">
      <div class="g__pad">
        <div
          ref="pan"
          class="g__plate bless-lean"
          :class="{ 'g__plate--dragging': dragging }"
          :style="{ translate: `${pos.x}px ${pos.y}px` }"
          tabindex="0"
          role="img"
          aria-label="Draggable plate — arrow keys move it"
          @keydown="nudge"
        >
          <span>drag</span>
        </div>
      </div>
      <BlessText size="xs" muted
        >usePan — {{ Math.round(pos.x) }}, {{ Math.round(pos.y) }}</BlessText
      >
    </div>
    <div class="g__row">
      <div ref="strip" class="g__strip">swipe ← →</div>
      <BlessText size="xs" muted>useSwipe — {{ direction ?? "…" }}</BlessText>
    </div>
    <div class="g__row">
      <!-- refs on Bless components are instances; the composables want an element -->
      <span ref="hold" class="g__wrap"
        ><BlessButton>{{ pressing ? "holding…" : "hold me" }}</BlessButton></span
      >
      <BlessText size="xs" muted>useLongPress — {{ held }}×</BlessText>
    </div>
    <div class="g__row">
      <div class="row" style="gap: 4px">
        <span ref="minus" class="g__wrap"
          ><BlessButton size="sm" variant="outline" aria-label="Decrease">−</BlessButton></span
        >
        <BlessText weight="bold" style="min-width: 2.5em; text-align: center">{{
          count
        }}</BlessText>
        <span ref="plus" class="g__wrap"
          ><BlessButton size="sm" variant="outline" aria-label="Increase">+</BlessButton></span
        >
      </div>
      <BlessText size="xs" muted>useTouchRepeat — hold a button</BlessText>
    </div>
  </div>
</template>

<style scoped>
.g {
  display: grid;
  gap: 16px;
}
.g__row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.g__pad {
  width: 200px;
  height: 80px;
  background: var(--bless-color-surface);
  overflow: hidden;
}
.g__plate {
  width: 64px;
  height: 32px;
  display: grid;
  place-items: center;
  margin: 24px 0 0 24px;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  transform: skewX(var(--bless-skew)); /* upright at rest; .bless-lean leans it on attention */
  touch-action: none; /* we take both axes */
  cursor: grab;
  user-select: none;
}
.g__plate > span {
  transform: skewX(var(--bless-skew-counter));
}
/* colour means chosen: the plate takes the accent only while held */
.g__plate--dragging {
  --bless-skew: var(--bless-lean);
  --bless-skew-counter: calc(-1 * var(--bless-lean));
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  cursor: grabbing;
}
.g__plate:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.g__wrap {
  display: inline-flex;
  touch-action: none;
  user-select: none;
}
.g__strip {
  width: 200px;
  padding: 12px;
  text-align: center;
  background: var(--bless-color-surface);
  font-size: var(--bless-text-sm);
  touch-action: pan-y; /* horizontal swipe; the page keeps vertical scroll */
  user-select: none;
}
</style>
