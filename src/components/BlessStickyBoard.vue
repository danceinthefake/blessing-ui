<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessStickyBoard" });
const pack = useLabelPack("BlessStickyBoard");

export interface BlessStickyNote {
  id: string;
  text: string;
  /** the place of the top left corner on the board, in pixels */
  x: number;
  y: number;
  color?: "yellow" | "pink" | "blue" | "green";
}

const props = withDefaults(
  defineProps<{
    /** the height of the board in pixels */
    height?: number;
    labels?: Partial<{
      board: string;
      add: string;
      note: (n: number) => string;
      move: string;
      color: string;
      remove: string;
    }>;
  }>(),
  { height: 360 },
);
const notes = defineModel<BlessStickyNote[]>({ default: () => [] });

const text = computed(() => ({
  board: "Board",
  add: "Add a note",
  note: (n: number) => `Note ${n}`,
  move: "Move: drag, or use the arrow keys",
  color: "Change the color",
  remove: "Delete the note",
  ...pack(),
  ...props.labels,
}));
const COLORS = ["yellow", "pink", "blue", "green"] as const;
const W = 160;
const H = 140;
const board = ref<HTMLElement>();
// a board with no width yet (not laid out) does not limit the right side
const boardWidth = () => board.value?.clientWidth || Infinity;
const clamp = (n: BlessStickyNote, x: number, y: number) => ({
  x: Math.round(Math.min(Math.max(0, x), Math.max(0, boardWidth() - W))),
  y: Math.round(Math.min(Math.max(0, y), Math.max(0, props.height - H))),
});
const patch = (id: string, p: Partial<BlessStickyNote>) =>
  (notes.value = notes.value.map((n) => (n.id === id ? { ...n, ...p } : n)));

let seq = 0;
function add() {
  const i = notes.value.length;
  const id = `n${Date.now().toString(36)}${seq++}`;
  // new notes step down and to the right, so they do not hide each other
  const at = { x: 16 + ((i * 24) % 200), y: 16 + ((i * 24) % 120) };
  notes.value = [...notes.value, { id, text: "", ...at, color: COLORS[i % COLORS.length] }];
  nextTick(() =>
    board.value?.querySelector<HTMLTextAreaElement>(`[data-note="${id}"] textarea`)?.focus(),
  );
}
const remove = (id: string) => (notes.value = notes.value.filter((n) => n.id !== id));
const cycle = (n: BlessStickyNote) =>
  patch(n.id, { color: COLORS[(COLORS.indexOf(n.color ?? "yellow") + 1) % COLORS.length] });

function onKey(e: KeyboardEvent, n: BlessStickyNote) {
  const step = e.shiftKey ? 40 : 10;
  const d = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  }[e.key];
  if (!d) return;
  e.preventDefault();
  patch(n.id, clamp(n, n.x + d[0]!, n.y + d[1]!));
}
let drag: { id: string; dx: number; dy: number } | undefined;
function down(e: PointerEvent, n: BlessStickyNote) {
  const r = board.value!.getBoundingClientRect();
  drag = { id: n.id, dx: e.clientX - r.left - n.x, dy: e.clientY - r.top - n.y };
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}
function move(e: PointerEvent) {
  if (!drag) return;
  const r = board.value!.getBoundingClientRect();
  const n = notes.value.find((x) => x.id === drag!.id);
  if (n) patch(n.id, clamp(n, e.clientX - r.left - drag.dx, e.clientY - r.top - drag.dy));
}
const up = () => (drag = undefined);
</script>

<template>
  <div class="bless-sticky">
    <button type="button" class="bless-sticky__add" @click="add">+ {{ text.add }}</button>
    <div
      ref="board"
      class="bless-sticky__board"
      role="region"
      :aria-label="text.board"
      :style="{ blockSize: `${height}px` }"
    >
      <article
        v-for="(n, i) in notes"
        :key="n.id"
        class="bless-sticky__note"
        :class="`is-${n.color ?? 'yellow'}`"
        :data-note="n.id"
        :style="{ insetInlineStart: `${n.x}px`, insetBlockStart: `${n.y}px` }"
        :aria-label="text.note(i + 1)"
      >
        <div class="bless-sticky__bar">
          <button
            type="button"
            class="bless-sticky__handle"
            :aria-label="text.move"
            :title="text.move"
            @pointerdown="down($event, n)"
            @pointermove="move"
            @pointerup="up"
            @keydown="onKey($event, n)"
          >
            ⠿
          </button>
          <button
            type="button"
            class="bless-sticky__tool"
            :aria-label="text.color"
            :title="text.color"
            @click="cycle(n)"
          >
            ◐
          </button>
          <button
            type="button"
            class="bless-sticky__tool"
            :aria-label="text.remove"
            :title="text.remove"
            @click="remove(n.id)"
          >
            ✕
          </button>
        </div>
        <textarea
          class="bless-sticky__text"
          :value="n.text"
          :aria-label="text.note(i + 1)"
          @input="patch(n.id, { text: ($event.target as HTMLTextAreaElement).value })"
        />
      </article>
    </div>
  </div>
</template>

<style>
.bless-sticky {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sticky__add {
  justify-self: start;
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-sticky__board {
  position: relative;
  overflow: hidden;
  border: var(--bless-border-width) dashed var(--bless-color-border);
  background:
    radial-gradient(circle, var(--bless-color-border) 1px, transparent 1px) 0 0 / 20px 20px,
    var(--bless-color-surface-2);
}
/* the notes keep a light paper color in both themes, with dark text on it */
.bless-sticky__note {
  position: absolute;
  display: flex;
  flex-direction: column;
  inline-size: 160px;
  block-size: 140px;
  box-shadow: 3px 3px 0 color-mix(in srgb, #000 25%, transparent);
  background: var(--_paper);
  color: var(--bless-color-on-light);
  --_paper: #fbe98a;
}
.bless-sticky__note.is-pink {
  --_paper: #f9c7d6;
}
.bless-sticky__note.is-blue {
  --_paper: #c5def5;
}
.bless-sticky__note.is-green {
  --_paper: #cbeac0;
}
.bless-sticky__bar {
  display: flex;
  gap: 2px;
  padding: 2px;
}
.bless-sticky__handle {
  flex: 1;
  cursor: grab;
  text-align: start;
  touch-action: none;
}
.bless-sticky__handle,
.bless-sticky__tool {
  min-block-size: 1.5rem;
  padding: 0 var(--bless-space-1);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
}
.bless-sticky__tool {
  cursor: pointer;
}
.bless-sticky__handle:focus-visible,
.bless-sticky__tool:focus-visible,
.bless-sticky__add:focus-visible,
.bless-sticky__text:focus-visible {
  outline: 2px solid var(--bless-color-text);
  outline-offset: -2px;
}
.bless-sticky__text {
  flex: 1;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  resize: none;
}
</style>
