<script lang="ts">
export type BlessSwipeDecision = "accept" | "reject" | "skip";
</script>

<script setup lang="ts" generic="T">
import { computed, ref } from "vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessSwipeDeck" });

const props = withDefaults(
  defineProps<{
    rowKey?: (item: T) => string | number;
    label?: string;
    /** show the buttons under the deck */
    controls?: boolean;
    /** how far (px) a drag must travel to count */
    threshold?: number;
    labels?: Partial<Record<BlessSwipeDecision | "undo", string>>;
  }>(),
  { label: "Cards", controls: true, threshold: 100 },
);
/** the cards still to decide, top of the deck first */
const model = defineModel<T[]>({ default: () => [] });
const emit = defineEmits<{ decide: [item: T, decision: BlessSwipeDecision]; undo: [item: T] }>();

const text = computed(() => ({
  accept: "Accept",
  reject: "Reject",
  skip: "Skip",
  undo: "Undo",
  ...props.labels,
}));
const history: { item: T; decision: BlessSwipeDecision }[] = [];
const undoable = ref(0);
const live = ref("");
const exit = { accept: [1, 0], reject: [-1, 0], skip: [0, -1] } as const;
/** where the card that just left is headed; the leave transition reads these */
const dir = ref<readonly [number, number]>([0, 0]);

function decide(decision: BlessSwipeDecision) {
  const [item, ...rest] = model.value;
  if (item === undefined) return;
  dir.value = exit[decision];
  history.push({ item, decision });
  undoable.value = history.length;
  model.value = rest;
  emit("decide", item, decision);
  live.value = `${text.value[decision]}. ${rest.length} left.`;
}
function undo() {
  const last = history.pop();
  if (!last) return;
  undoable.value = history.length;
  dir.value = [0, 0];
  model.value = [last.item, ...model.value];
  emit("undo", last.item);
  live.value = `${text.value.undo}. ${model.value.length} left.`;
}
defineExpose({
  accept: () => decide("accept"),
  reject: () => decide("reject"),
  skip: () => decide("skip"),
  undo,
});

// --- drag the top card ---
const drag = ref<{ x: number; y: number; sx: number; sy: number } | null>(null);
function down(e: PointerEvent) {
  if (e.button) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  drag.value = { x: 0, y: 0, sx: e.clientX, sy: e.clientY };
}
function move(e: PointerEvent) {
  const d = drag.value;
  if (d) ((d.x = e.clientX - d.sx), (d.y = e.clientY - d.sy));
}
function up() {
  const d = drag.value;
  if (!d) return;
  const t = props.threshold;
  const ax = Math.abs(d.x);
  const ay = Math.abs(d.y);
  const verdict: BlessSwipeDecision | null =
    ax >= ay && ax > t ? (d.x > 0 ? "accept" : "reject") : ay > ax && d.y < -t ? "skip" : null;
  if (verdict) decide(verdict);
  drag.value = null;
}
const lean = computed(() => {
  const d = drag.value;
  if (!d) return { accept: 0, reject: 0, skip: 0 };
  const k = (v: number) => Math.min(1, Math.max(0, v / props.threshold));
  return { accept: k(d.x), reject: k(-d.x), skip: k(-d.y) };
});
const topStyle = computed(() => {
  const d = drag.value;
  return d
    ? { transform: `translate(${d.x}px, ${d.y}px) rotate(${d.x / 24}deg)`, transition: "none" }
    : undefined;
});

function onKey(e: KeyboardEvent) {
  const map: Record<string, BlessSwipeDecision> = {
    ArrowRight: "accept",
    ArrowLeft: "reject",
    ArrowUp: "skip",
  };
  if (map[e.key]) (e.preventDefault(), decide(map[e.key]!));
  else if (e.key === "Backspace" || ((e.ctrlKey || e.metaKey) && e.key === "z"))
    (e.preventDefault(), undo());
}
const shown = computed(() => model.value.slice(0, 3));
</script>

<template>
  <div class="bless-deck" :style="{ '--bless-deck-x': dir[0], '--bless-deck-y': dir[1] }">
    <div
      class="bless-deck__stage"
      tabindex="0"
      role="group"
      aria-roledescription="deck of cards"
      :aria-label="`${label}, ${model.length} left. Right arrow ${text.accept}, left arrow ${text.reject}, up arrow ${text.skip}, Backspace ${text.undo}.`"
      @keydown="onKey"
    >
      <TransitionGroup name="bless-deck">
        <div
          v-for="(item, i) in shown"
          :key="rowKey ? rowKey(item) : model.length - i"
          class="bless-deck__card"
          :class="{ 'bless-deck__card--top': i === 0 }"
          :style="i === 0 ? topStyle : { '--bless-deck-depth': i }"
          :aria-hidden="i > 0 || undefined"
          :inert="i > 0 || undefined"
          @pointerdown="i === 0 && down($event)"
          @pointermove="i === 0 && move($event)"
          @pointerup="i === 0 && up()"
          @pointercancel="i === 0 && (drag = null)"
        >
          <slot name="card" :item :index="i">{{ item }}</slot>
          <template v-if="i === 0">
            <span
              class="bless-deck__stamp bless-deck__stamp--accept"
              aria-hidden="true"
              :style="{ opacity: lean.accept }"
              >{{ text.accept }}</span
            >
            <span
              class="bless-deck__stamp bless-deck__stamp--reject"
              aria-hidden="true"
              :style="{ opacity: lean.reject }"
              >{{ text.reject }}</span
            >
            <span
              class="bless-deck__stamp bless-deck__stamp--skip"
              aria-hidden="true"
              :style="{ opacity: lean.skip }"
              >{{ text.skip }}</span
            >
          </template>
        </div>
      </TransitionGroup>
      <div v-if="!model.length" class="bless-deck__empty">
        <slot name="empty">No cards left</slot>
      </div>
    </div>
    <div v-if="controls" class="bless-deck__controls">
      <BlessButton variant="outline" :disabled="!undoable" @click="undo">{{
        text.undo
      }}</BlessButton>
      <BlessButton variant="outline" :disabled="!model.length" @click="decide('reject')">{{
        text.reject
      }}</BlessButton>
      <BlessButton variant="outline" :disabled="!model.length" @click="decide('skip')">{{
        text.skip
      }}</BlessButton>
      <BlessButton :disabled="!model.length" @click="decide('accept')">{{
        text.accept
      }}</BlessButton>
    </div>
    <span class="bless-deck__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-deck {
  position: relative;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-deck__stage {
  position: relative;
  display: grid;
  min-height: 240px;
}
.bless-deck__stage:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 4px;
}
.bless-deck__card {
  grid-area: 1 / 1;
  position: relative;
  padding: var(--bless-space-8) var(--bless-space-4) var(--bless-space-4); /* room for the stamps */
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  box-shadow: var(--bless-shadow-plate);
  translate: 0 calc(var(--bless-deck-depth, 0) * 8px);
  scale: calc(1 - var(--bless-deck-depth, 0) * 0.04);
  transition:
    transform var(--bless-duration-slow) var(--bless-ease-out),
    translate var(--bless-duration-slow) var(--bless-ease-out),
    scale var(--bless-duration-slow) var(--bless-ease-out),
    opacity var(--bless-duration-slow) var(--bless-ease-out);
  user-select: none;
}
.bless-deck__card--top {
  z-index: 3;
  cursor: grab;
  touch-action: none;
}
.bless-deck__card:nth-child(2) {
  z-index: 2;
}
.bless-deck__card:nth-child(3) {
  z-index: 1;
}
.bless-deck-leave-active {
  z-index: 4;
  pointer-events: none;
}
.bless-deck-leave-to {
  opacity: 0;
  translate: calc(var(--bless-deck-x) * 140%) calc(var(--bless-deck-y) * 140%);
}
.bless-deck-enter-from {
  opacity: 0;
}
.bless-deck__stamp {
  position: absolute;
  top: var(--bless-space-3);
  padding: 0 var(--bless-space-2);
  border: 2px solid currentColor;
  font-weight: 700;
  text-transform: uppercase;
  pointer-events: none;
  opacity: 0;
}
.bless-deck__stamp--accept {
  inset-inline-start: var(--bless-space-3);
}
.bless-deck__stamp--reject {
  inset-inline-end: var(--bless-space-3);
}
.bless-deck__stamp--skip {
  inset-inline-start: 50%;
  translate: -50% 0;
}
.bless-deck__empty {
  grid-area: 1 / 1;
  display: grid;
  place-items: center;
  color: var(--bless-color-text-muted);
}
.bless-deck__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-4);
}
.bless-deck__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@media (prefers-reduced-motion: reduce) {
  .bless-deck__card {
    transition: none;
  }
}
</style>
