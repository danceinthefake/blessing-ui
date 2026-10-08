<script lang="ts">
export type { Region as BlessRegion } from "../composables/annotate";
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import {
  boxFrom,
  isBox,
  MIN_SIDE,
  moveRegion,
  nextId,
  resizeRegion,
  type Region,
} from "../composables/annotate";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessAnnotator" });

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    /** off: the marks are shown and selected, nothing is drawn, moved or removed */
    editable?: boolean;
    label?: string;
    labels?: Partial<{
      tools: string;
      select: string;
      box: string;
      pin: string;
      add: string;
      remove: string;
      name: string;
      regions: string;
      regionName: (kind: "box" | "pin", n: number, label: string) => string;
      added: (name: string) => string;
      removed: (name: string) => string;
      moved: (x: number, y: number) => string;
      hint: string;
    }>;
  }>(),
  { alt: "", editable: true, label: "Annotated image" },
);
/** the marks, as fractions of the image */
const model = defineModel<Region[]>({ default: () => [] });
const selected = defineModel<string | null>("selected", { default: null });
/** what a drag or click on the empty image does */
const tool = defineModel<"select" | "box" | "pin">("tool", { default: "box" });

const text = computed(() => ({
  tools: "Tools",
  select: "Select",
  box: "Box",
  pin: "Pin",
  add: "Add at centre",
  remove: "Remove",
  name: "Name",
  regions: "Marks",
  regionName: (k: string, n: number, l: string) =>
    `${k === "box" ? text.value.box : text.value.pin} ${n}${l ? `: ${l}` : ""}`,
  added: (n: string) => `${n} added`,
  removed: (n: string) => `${n} removed`,
  moved: (x: number, y: number) => `${x}% across, ${y}% down`,
  hint: "Arrow keys move the mark, Alt with arrows resizes a box, Delete removes it.",
  ...props.labels,
}));

const id = useId();
const hint = `${id}-hint`;
const stage = ref<HTMLElement>();
const nameInput = ref<HTMLInputElement>();
const live = ref("");

const nameOf = (r: Region) =>
  text.value.regionName(isBox(r) ? "box" : "pin", model.value.indexOf(r) + 1, r.label);
const current = computed(() => model.value.find((r) => r.id === selected.value));
const pct = (n: number) => `${n * 100}%`;
const place = (r: Region) => ({
  left: pct(r.x),
  top: pct(r.y),
  ...(isBox(r) ? { width: pct(r.w), height: pct(r.h) } : {}),
});

const point = (e: PointerEvent) => {
  const b = stage.value!.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (e.clientX - b.left) / (b.width || 1))),
    y: Math.min(1, Math.max(0, (e.clientY - b.top) / (b.height || 1))),
  };
};
const patch = (r: Region) => (model.value = model.value.map((m) => (m.id === r.id ? r : m)));

function add(r: Omit<Region, "id" | "label">) {
  const region: Region = { id: nextId(model.value), label: "", ...r };
  const all = [...model.value, region];
  model.value = all;
  selected.value = region.id;
  live.value = text.value.added(
    text.value.regionName(isBox(region) ? "box" : "pin", all.length, ""),
  );
  nextTick(() => nameInput.value?.focus());
}
function addAtCentre() {
  if (tool.value === "pin") add({ x: 0.5, y: 0.5 });
  else add({ x: 0.35, y: 0.35, w: 0.3, h: 0.3 });
}
function remove(r: Region) {
  const name = nameOf(r);
  const i = model.value.indexOf(r);
  const rest = model.value.filter((m) => m !== r);
  model.value = rest;
  selected.value = rest[Math.min(i, rest.length - 1)]?.id ?? null;
  live.value = text.value.removed(name);
  nextTick(() => (selected.value ? focusRegion(selected.value) : stage.value?.focus()));
}
const focusRegion = (rid: string) =>
  stage.value?.querySelector<HTMLElement>(`[data-region="${CSS.escape(rid)}"]`)?.focus();

// --- pointer: draw on the image, drag a mark, drag a box's corner ---
type Drag =
  | { kind: "draw"; from: { x: number; y: number } }
  | { kind: "move" | "size"; r: Region; from: { x: number; y: number } };
let drag: Drag | null = null;
const draft = ref<ReturnType<typeof boxFrom> | null>(null);

function stageDown(e: PointerEvent) {
  if (e.button || (e.target as HTMLElement).closest("[data-region]")) return;
  selected.value = null;
  if (!props.editable || tool.value === "select") return;
  const p = point(e);
  if (tool.value === "pin") return add({ x: p.x, y: p.y });
  stage.value!.setPointerCapture?.(e.pointerId);
  drag = { kind: "draw", from: p };
  draft.value = boxFrom(p, p);
}
function regionDown(r: Region, e: PointerEvent, kind: "move" | "size") {
  if (e.button) return;
  e.stopPropagation();
  selected.value = r.id;
  if (!props.editable) return;
  stage.value!.setPointerCapture?.(e.pointerId);
  drag = { kind, r, from: point(e) };
}
function move(e: PointerEvent) {
  if (!drag) return;
  const p = point(e);
  if (drag.kind === "draw") draft.value = boxFrom(drag.from, p);
  else if (drag.kind === "move") patch(moveRegion(drag.r, p.x - drag.from.x, p.y - drag.from.y));
  else patch(resizeRegion(drag.r, p.x - drag.from.x, p.y - drag.from.y));
}
function up() {
  const d = draft.value;
  const was = drag;
  drag = null;
  draft.value = null;
  if (was?.kind === "draw" && d && d.w >= MIN_SIDE && d.h >= MIN_SIDE) add(d);
}

// --- keyboard on a mark ---
function onKey(r: Region, e: KeyboardEvent) {
  if ((e.target as HTMLElement).closest("input")) return;
  const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[
    e.key as "ArrowLeft"
  ];
  if (dir && props.editable) {
    e.preventDefault();
    const s = e.shiftKey ? 0.05 : 0.01;
    const next = e.altKey
      ? resizeRegion(r, dir[0]! * s, dir[1]! * s)
      : moveRegion(r, dir[0]! * s, dir[1]! * s);
    patch(next);
    live.value = text.value.moved(Math.round(next.x * 100), Math.round(next.y * 100));
  } else if ((e.key === "Delete" || e.key === "Backspace") && props.editable) {
    e.preventDefault();
    remove(r);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selected.value = r.id;
    nextTick(() => nameInput.value?.focus());
  }
}
const tab = computed(() => selected.value ?? model.value[0]?.id);
const setName = (v: string) => current.value && patch({ ...current.value, label: v });
</script>

<template>
  <div class="bless-annot">
    <div v-if="editable" class="bless-annot__bar" role="toolbar" :aria-label="text.tools">
      <BlessButton
        v-for="t in ['select', 'box', 'pin'] as const"
        :key="t"
        size="sm"
        :variant="tool === t ? 'solid' : 'outline'"
        :aria-pressed="tool === t"
        @click="tool = t"
        >{{ text[t] }}</BlessButton
      >
      <BlessButton size="sm" variant="ghost" @click="addAtCentre">{{ text.add }}</BlessButton>
      <BlessButton
        size="sm"
        variant="ghost"
        :disabled="!current"
        @click="current && remove(current)"
        >{{ text.remove }}</BlessButton
      >
    </div>
    <div
      ref="stage"
      class="bless-annot__stage"
      :class="[`bless-annot__stage--${tool}`, { 'bless-annot__stage--ro': !editable }]"
      role="group"
      :aria-label="label"
      :aria-describedby="hint"
      tabindex="-1"
      @pointerdown="stageDown"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="up"
    >
      <img class="bless-annot__img" :src :alt draggable="false" />
      <div
        v-for="(r, i) in model"
        :key="r.id"
        class="bless-annot__mark"
        :class="[
          isBox(r) ? 'bless-annot__mark--box' : 'bless-annot__mark--pin',
          { 'bless-annot__mark--sel': selected === r.id },
        ]"
        :style="place(r)"
        :data-region="r.id"
        role="button"
        :aria-pressed="selected === r.id"
        :aria-label="nameOf(r)"
        :tabindex="tab === r.id ? 0 : -1"
        @pointerdown="regionDown(r, $event, 'move')"
        @keydown="onKey(r, $event)"
        @focus="selected = r.id"
      >
        <span class="bless-annot__num" aria-hidden="true">{{ i + 1 }}</span>
        <span
          v-if="editable && isBox(r) && selected === r.id"
          class="bless-annot__handle"
          aria-hidden="true"
          @pointerdown="regionDown(r, $event, 'size')"
        />
      </div>
      <div
        v-if="draft"
        class="bless-annot__mark bless-annot__mark--box bless-annot__mark--draft"
        :style="place({ id: '', label: '', ...draft })"
      />
    </div>
    <div v-if="current && editable" class="bless-annot__edit">
      <label class="bless-annot__field">
        <span>{{ text.name }}</span>
        <input
          ref="nameInput"
          class="bless-annot__input"
          type="text"
          :value="current.label"
          @input="setName(($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>
    <ol v-if="model.length" class="bless-annot__list" :aria-label="text.regions">
      <li v-for="r in model" :key="r.id">
        <button
          type="button"
          class="bless-annot__item"
          :aria-pressed="selected === r.id"
          @click="((selected = r.id), focusRegion(r.id))"
        >
          {{ nameOf(r) }}
        </button>
      </li>
    </ol>
    <span :id="hint" hidden>{{ text.hint }}</span>
    <span class="bless-annot__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-annot {
  position: relative;
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-annot__bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-annot__stage {
  position: relative;
  line-height: 0;
  user-select: none;
  touch-action: none;
  cursor: crosshair;
  outline: none;
}
.bless-annot__stage--select,
.bless-annot__stage--ro {
  cursor: default;
}
.bless-annot__img {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}
.bless-annot__mark {
  position: absolute;
  box-sizing: border-box;
  line-height: 1;
  cursor: move;
}
.bless-annot__mark--box {
  border: 2px solid var(--bless-color-accent);
  background: color-mix(in srgb, var(--bless-color-accent) 14%, transparent);
}
.bless-annot__mark--pin {
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  background: var(--bless-color-accent);
  border: 2px solid var(--bless-color-bg);
}
.bless-annot__mark--sel {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 2px;
}
.bless-annot__mark:focus-visible {
  outline: 3px solid var(--bless-color-text);
  outline-offset: 2px;
}
.bless-annot__mark--draft {
  border-style: dashed;
  pointer-events: none;
}
.bless-annot__num {
  position: absolute;
  top: -2px;
  left: -2px;
  min-width: 18px;
  padding: 2px 4px;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
  text-align: center;
}
.bless-annot__mark--pin .bless-annot__num {
  position: static;
  display: block;
  padding: 0;
  background: none;
  line-height: 16px;
}
.bless-annot__handle {
  position: absolute;
  right: -7px;
  bottom: -7px;
  width: 14px;
  height: 14px;
  background: var(--bless-color-bg);
  border: 2px solid var(--bless-color-accent);
  cursor: nwse-resize;
}
.bless-annot__field {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-annot__input {
  flex: 1;
  min-height: 32px;
  padding: var(--bless-space-1) var(--bless-space-2);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: inherit;
  font: inherit;
}
.bless-annot__input:focus-visible,
.bless-annot__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-annot__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-annot__item {
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-annot__item[aria-pressed="true"] {
  border-color: var(--bless-color-accent);
}
.bless-annot__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
