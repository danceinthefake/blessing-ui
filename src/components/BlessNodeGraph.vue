<script lang="ts">
export interface BlessGraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}
export type { GraphEdge as BlessGraphEdge } from "../composables/graph";
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import BlessInfiniteCanvas, { type CanvasView } from "./BlessInfiniteCanvas.vue";
import {
  edgeKey,
  edgePath,
  linkProblem,
  snapTo,
  type GraphEdge as Edge,
} from "../composables/graph";

defineOptions({ name: "BlessNodeGraph" });

const props = withDefaults(
  defineProps<{
    /** size used for ports and links; put content that fits it in the `#node` slot */
    nodeWidth?: number;
    nodeHeight?: number;
    /** snap dragged nodes to this grid, px; 0 is free */
    snap?: number;
    /** refuse a link that would close a loop */
    acyclic?: boolean;
    /** off: nodes can be selected and the view moved, nothing is dragged, linked or removed */
    editable?: boolean;
    grid?: boolean;
    controls?: boolean;
    minZoom?: number;
    maxZoom?: number;
    label?: string;
    labels?: Partial<{
      node: (label: string, to: string[], from: string[]) => string;
      linkFrom: (from: string) => string;
      linkTo: (from: string, to: string, exists: boolean) => string;
      linked: (from: string, to: string) => string;
      unlinked: (from: string, to: string) => string;
      refused: (from: string, to: string, why: "self" | "exists" | "cycle") => string;
      cancelled: string;
      removed: (label: string) => string;
      hint: string;
    }>;
  }>(),
  {
    nodeWidth: 160,
    nodeHeight: 56,
    snap: 0,
    editable: true,
    grid: true,
    controls: true,
    label: "Graph",
  },
);
const nodes = defineModel<BlessGraphNode[]>("nodes", { default: () => [] });
const edges = defineModel<Edge[]>("edges", { default: () => [] });
const selected = defineModel<string | null>("selected", { default: null });
const view = defineModel<CanvasView>("view", { default: () => ({ x: 0, y: 0, zoom: 1 }) });
const emit = defineEmits<{
  connect: [edge: Edge];
  disconnect: [edge: Edge];
  move: [id: string, x: number, y: number];
  remove: [id: string];
}>();

const text = computed(() => ({
  node: (l: string, to: string[], from: string[]) =>
    l +
    (to.length ? `. Links to ${to.join(", ")}` : "") +
    (from.length ? `. Linked from ${from.join(", ")}` : ""),
  linkFrom: (a: string) =>
    `Linking from ${a}. Arrow keys choose the target, Enter links or unlinks, Escape cancels.`,
  linkTo: (a: string, b: string, exists: boolean) =>
    a === b ? `${a}: choose another node` : `${exists ? "Unlink" : "Link"} ${a} to ${b}? Enter`,
  linked: (a: string, b: string) => `Linked ${a} to ${b}`,
  unlinked: (a: string, b: string) => `Unlinked ${a} from ${b}`,
  refused: (a: string, b: string, why: string) =>
    why === "cycle" ? `Not linked: ${b} already leads to ${a}` : `Not linked: ${a} to ${b}`,
  cancelled: "Cancelled",
  removed: (l: string) => `Removed ${l}`,
  hint: "Arrow keys move the node, L starts a link, Delete removes it.",
  ...props.labels,
}));

const root = ref<HTMLElement>();
const canvas = ref<InstanceType<typeof BlessInfiniteCanvas>>();
const live = ref("");
const hint = `${useId()}-hint`;
const markerId = `${useId()}-arrow`;

const byId = computed(() => new Map(nodes.value.map((n) => [n.id, n])));
const out = (n: BlessGraphNode) => ({ x: n.x + props.nodeWidth, y: n.y + props.nodeHeight / 2 });
const inn = (n: BlessGraphNode) => ({ x: n.x, y: n.y + props.nodeHeight / 2 });
const drawn = computed(() =>
  edges.value.flatMap((e) => {
    const a = byId.value.get(e.from);
    const b = byId.value.get(e.to);
    return a && b ? [{ edge: e, key: edgeKey(e), d: edgePath(out(a), inn(b)) }] : [];
  }),
);
const labelOf = (id: string) => byId.value.get(id)?.label ?? id;
const nameFor = (n: BlessGraphNode) =>
  text.value.node(
    n.label,
    edges.value.filter((e) => e.from === n.id).map((e) => labelOf(e.to)),
    edges.value.filter((e) => e.to === n.id).map((e) => labelOf(e.from)),
  );

// --- edges ---
const edgeSel = ref<string | null>(null);
function link(from: string, to: string) {
  const why = linkProblem(edges.value, from, to, props.acyclic);
  if (why === "exists") {
    const e = edges.value.find((x) => x.from === from && x.to === to)!;
    edges.value = edges.value.filter((x) => x !== e);
    emit("disconnect", e);
    live.value = text.value.unlinked(labelOf(from), labelOf(to));
  } else if (why) live.value = text.value.refused(labelOf(from), labelOf(to), why);
  else {
    const e = { from, to };
    edges.value = [...edges.value, e];
    emit("connect", e);
    live.value = text.value.linked(labelOf(from), labelOf(to));
  }
}

// --- pointer: drag a node, or pull a link from its output port ---
const dragging = ref<{
  id: string;
  cx: number;
  cy: number;
  x: number;
  y: number;
  moved: boolean;
} | null>(null);
const pulling = ref<{ from: string; x: number; y: number } | null>(null);
const nodeEl = (id: string) =>
  root.value?.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(id)}"]`);

function nodeDown(n: BlessGraphNode, e: PointerEvent) {
  selected.value = n.id;
  edgeSel.value = null;
  if (!props.editable || e.button) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  dragging.value = { id: n.id, cx: e.clientX, cy: e.clientY, x: n.x, y: n.y, moved: false };
}
function nodeMove(n: BlessGraphNode, e: PointerEvent) {
  const d = dragging.value;
  if (!d || d.id !== n.id) return;
  const z = view.value.zoom;
  const x = snapTo(d.x + (e.clientX - d.cx) / z, props.snap);
  const y = snapTo(d.y + (e.clientY - d.cy) / z, props.snap);
  if (x === n.x && y === n.y) return;
  d.moved = true;
  nodes.value = nodes.value.map((m) => (m.id === n.id ? { ...m, x, y } : m));
}
function nodeUp(n: BlessGraphNode) {
  const d = dragging.value;
  dragging.value = null;
  if (d?.moved) {
    const m = byId.value.get(n.id)!;
    emit("move", n.id, m.x, m.y);
  }
}
function portDown(n: BlessGraphNode, e: PointerEvent) {
  if (!props.editable || e.button) return;
  e.stopPropagation();
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  const p = canvas.value!.toWorld(e.clientX, e.clientY);
  pulling.value = { from: n.id, ...p };
}
function portMove(e: PointerEvent) {
  if (pulling.value)
    pulling.value = { ...pulling.value, ...canvas.value!.toWorld(e.clientX, e.clientY) };
}
function portUp(e: PointerEvent) {
  const p = pulling.value;
  pulling.value = null;
  if (!p) return;
  for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
    const id = (el as HTMLElement).closest?.("[data-node-id]")?.getAttribute("data-node-id");
    if (id && root.value?.contains(el)) return void link(p.from, id);
  }
}
const preview = computed(() => {
  const a = pulling.value && byId.value.get(pulling.value.from);
  if (a && pulling.value) return edgePath(out(a), pulling.value);
  const k = linking.value;
  const from = k && byId.value.get(k.from);
  const to = k && byId.value.get(k.target);
  return from && to && from !== to ? edgePath(out(from), inn(to)) : null;
});

// --- keyboard ---
const linking = ref<{ from: string; target: string } | null>(null);
const focusNode = (id: string) => nextTick(() => nodeEl(id)?.focus());
function onKey(n: BlessGraphNode, e: KeyboardEvent) {
  const k = linking.value;
  if (k) {
    const list = nodes.value;
    const at = list.findIndex((m) => m.id === k.target);
    const step = /^Arrow(Right|Down)$/.test(e.key) ? 1 : /^Arrow(Left|Up)$/.test(e.key) ? -1 : 0;
    if (step) {
      e.preventDefault();
      const t = list[(at + step + list.length) % list.length]!;
      linking.value = { from: k.from, target: t.id };
      live.value = text.value.linkTo(
        labelOf(k.from),
        t.label,
        edges.value.some((x) => x.from === k.from && x.to === t.id),
      );
      focusNode(t.id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      linking.value = null;
      if (k.target !== k.from) link(k.from, k.target);
      focusNode(k.from);
    } else if (e.key === "Escape") {
      e.preventDefault();
      linking.value = null;
      live.value = text.value.cancelled;
      focusNode(k.from);
    }
    return;
  }
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selected.value = n.id;
    return;
  }
  if (!props.editable) return;
  const s = e.shiftKey ? 32 : 8;
  const move = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[
    e.key
  ];
  if (move) {
    e.preventDefault();
    const x = n.x + move[0]!;
    const y = n.y + move[1]!;
    nodes.value = nodes.value.map((m) => (m.id === n.id ? { ...m, x, y } : m));
    emit("move", n.id, x, y);
  } else if (e.key === "l" || e.key === "L") {
    e.preventDefault();
    linking.value = { from: n.id, target: n.id };
    live.value = text.value.linkFrom(n.label);
  } else if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    const i = nodes.value.findIndex((m) => m.id === n.id);
    nodes.value = nodes.value.filter((m) => m.id !== n.id);
    edges.value = edges.value.filter((x) => x.from !== n.id && x.to !== n.id);
    if (selected.value === n.id) selected.value = null;
    emit("remove", n.id);
    live.value = text.value.removed(n.label);
    const next = nodes.value[Math.min(i, nodes.value.length - 1)];
    if (next) focusNode(next.id);
    else root.value?.querySelector<HTMLElement>(".bless-canvas")?.focus();
  }
}
// an edge picked with the mouse is removed with Delete while the canvas has focus
function canvasKey(e: KeyboardEvent) {
  if (!props.editable || !edgeSel.value || !/^(Delete|Backspace)$/.test(e.key)) return;
  if ((e.target as HTMLElement).closest?.("[data-node-id]")) return;
  const hit = drawn.value.find((d) => d.key === edgeSel.value);
  if (!hit) return;
  e.preventDefault();
  edges.value = edges.value.filter((x) => x !== hit.edge);
  emit("disconnect", hit.edge);
  live.value = text.value.unlinked(labelOf(hit.edge.from), labelOf(hit.edge.to));
  edgeSel.value = null;
}
// one node is in the tab order: the selected one, else the first
const tabId = computed(() =>
  selected.value && byId.value.has(selected.value) ? selected.value : nodes.value[0]?.id,
);
</script>

<template>
  <div ref="root" class="bless-graph" @keydown="canvasKey">
    <BlessInfiniteCanvas
      ref="canvas"
      v-model:view="view"
      :grid
      :controls
      :min-zoom
      :max-zoom
      :label
    >
      <svg class="bless-graph__edges" aria-hidden="true">
        <defs>
          <marker
            :id="markerId"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path d="M0 0L8 4L0 8z" class="bless-graph__arrow" />
          </marker>
        </defs>
        <g v-for="d in drawn" :key="d.key">
          <path
            class="bless-graph__edge"
            :class="{ 'bless-graph__edge--sel': edgeSel === d.key }"
            :d="d.d"
            :marker-end="`url(#${markerId})`"
          />
          <path
            class="bless-graph__edge-hit"
            :d="d.d"
            @pointerdown.stop="((edgeSel = d.key), (selected = null))"
          />
        </g>
        <path v-if="preview" class="bless-graph__edge bless-graph__edge--preview" :d="preview" />
      </svg>
      <div
        v-for="n in nodes"
        :key="n.id"
        class="bless-graph__node"
        :class="{
          'bless-graph__node--sel': selected === n.id,
          'bless-graph__node--target': linking?.target === n.id && linking.from !== n.id,
          'bless-graph__node--drag': dragging?.id === n.id,
        }"
        :data-node-id="n.id"
        role="group"
        aria-roledescription="node"
        :aria-label="nameFor(n)"
        :aria-describedby="hint"
        :tabindex="tabId === n.id ? 0 : -1"
        :style="{
          left: `${n.x}px`,
          top: `${n.y}px`,
          width: `${nodeWidth}px`,
          height: `${nodeHeight}px`,
        }"
        @pointerdown="nodeDown(n, $event)"
        @pointermove="nodeMove(n, $event)"
        @pointerup="nodeUp(n)"
        @pointercancel="nodeUp(n)"
        @keydown.self="onKey(n, $event)"
      >
        <span class="bless-graph__port bless-graph__port--in" aria-hidden="true" />
        <slot name="node" :node="n" :selected="selected === n.id">
          <span class="bless-graph__label">{{ n.label }}</span>
        </slot>
        <span
          v-if="editable"
          class="bless-graph__port bless-graph__port--out"
          aria-hidden="true"
          @pointerdown="portDown(n, $event)"
          @pointermove="portMove"
          @pointerup="portUp"
          @pointercancel="pulling = null"
        />
      </div>
    </BlessInfiniteCanvas>
    <span :id="hint" hidden>{{ text.hint }}</span>
    <span class="bless-graph__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-graph {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.bless-graph > .bless-canvas {
  flex: 1;
}
.bless-graph__edges {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  overflow: visible;
  pointer-events: none;
}
.bless-graph__edge {
  fill: none;
  stroke: var(--bless-color-text-muted);
  stroke-width: 2;
}
.bless-graph__edge--sel {
  stroke: var(--bless-color-accent);
  stroke-width: 3;
}
.bless-graph__edge--preview {
  stroke: var(--bless-color-accent);
  stroke-dasharray: 6 4;
}
.bless-graph__arrow {
  fill: var(--bless-color-text-muted);
}
.bless-graph__edge-hit {
  fill: none;
  stroke: transparent;
  stroke-width: 14;
  pointer-events: stroke;
  cursor: pointer;
}
.bless-graph__node {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 var(--bless-space-3);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: grab;
  touch-action: none;
}
.bless-graph__node:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-graph__node--sel {
  border-color: var(--bless-color-accent);
}
.bless-graph__node--target {
  outline: 2px dashed var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-graph__node--drag {
  cursor: grabbing;
}
.bless-graph__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-graph__port {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  margin-top: -6px;
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-text-muted);
}
.bless-graph__port--in {
  left: -7px;
}
.bless-graph__port--out {
  right: -7px;
  cursor: crosshair;
  touch-action: none;
}
.bless-graph__port--out:hover {
  border-color: var(--bless-color-accent);
}
.bless-graph__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
