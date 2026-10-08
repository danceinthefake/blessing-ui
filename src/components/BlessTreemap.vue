<script lang="ts">
export type { TreemapNode as BlessTreemapNode } from "../composables/treemap";
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { neighbour, squarify, totalOf, type TreemapNode } from "../composables/treemap";

defineOptions({ name: "BlessTreemap" });

const props = withDefaults(
  defineProps<{
    data: TreemapNode[];
    height?: number;
    /** text for a size, e.g. `(v) => v + " MB"` */
    format?: (v: number) => string;
    /** name of the top level in the path, and of the whole chart for screen readers */
    label?: string;
    labels?: Partial<{
      tile: (label: string, value: string, share: string, children: number) => string;
      path: string;
      up: string;
      hint: string;
    }>;
  }>(),
  { height: 320, label: "All" },
);
/** ids from the top down to the level being shown */
const path = defineModel<string[]>("path", { default: () => [] });
const emit = defineEmits<{ select: [node: TreemapNode, path: string[]] }>();

const text = computed(() => ({
  tile: (l: string, v: string, s: string, n: number) =>
    `${l}, ${v}, ${s}${n ? `, contains ${n} items, Enter opens` : ""}`,
  path: "Path",
  up: "Up one level",
  hint: "Arrow keys move between tiles, Enter opens or selects, Backspace goes up.",
  ...props.labels,
}));
const fmt = computed(() => props.format ?? ((v: number) => new Intl.NumberFormat().format(v)));
const pct = (f: number) => `${f < 0.01 ? "<1" : Math.round(f * 100)}%`;

const box = ref<HTMLElement>();
const width = ref(640); // measured on mount, so the server and first client render agree
let ro: ResizeObserver | undefined;
onMounted(() => {
  const read = () => (width.value = box.value?.clientWidth || width.value);
  read();
  if (typeof ResizeObserver === "function" && box.value) {
    ro = new ResizeObserver(read);
    ro.observe(box.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());

// the nodes from the top down to the shown level; a path that no longer exists falls back to the top
const trail = computed(() => {
  const out: TreemapNode[] = [];
  let level = props.data;
  for (const id of path.value) {
    const n = level.find((x) => x.id === id);
    if (!n?.children) break;
    out.push(n);
    level = n.children;
  }
  return out;
});
const level = computed(() =>
  (trail.value.at(-1)?.children ?? props.data).filter((n) => totalOf(n) > 0),
);
const sum = computed(() => level.value.reduce((a, n) => a + totalOf(n), 0));
const rects = computed(() => squarify(level.value.map(totalOf), width.value, props.height));
// each top-level node has one colour; everything drilled into from it keeps it
const colorOf = (n: TreemapNode, i: number) => {
  const top = trail.value[0];
  const c = n.color ?? top?.color ?? `chart-${((top ? props.data.indexOf(top) : i) % 5) + 1}`;
  return /^[a-z0-9-]+$/i.test(c) ? `var(--bless-color-${c})` : c;
};
const tiles = computed(() =>
  level.value.map((n, i) => {
    const r = rects.value[i]!;
    const v = totalOf(n);
    return {
      node: n,
      v,
      r,
      color: colorOf(n, i),
      big: r.w >= 64 && r.h >= 34,
      tall: r.h >= 54,
      name: text.value.tile(
        n.label,
        fmt.value(v),
        pct(v / (sum.value || 1)),
        n.children?.length ?? 0,
      ),
    };
  }),
);

const active = ref(0);
const tabAt = computed(() => Math.min(active.value, Math.max(0, tiles.value.length - 1)));
const focusTile = (i: number) => {
  active.value = i;
  nextTick(() => box.value?.querySelectorAll<HTMLElement>(".bless-treemap__tile")[i]?.focus());
};
function open(i: number) {
  const t = tiles.value[i]!;
  const ids = [...path.value.slice(0, trail.value.length), t.node.id];
  if (t.node.children?.length) {
    path.value = ids;
    active.value = 0;
  }
  emit("select", t.node, ids);
}
/** go up so that `depth` levels of the path remain; focus lands on the tile we came out of */
function up(depth = trail.value.length - 1) {
  if (depth < 0) return;
  const left = trail.value[depth]?.id;
  path.value = path.value.slice(0, depth);
  nextTick(() =>
    focusTile(
      Math.max(
        0,
        level.value.findIndex((n) => n.id === left),
      ),
    ),
  );
}
function onKey(i: number, e: KeyboardEvent) {
  const dir = (
    { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" } as const
  )[e.key as "ArrowLeft"];
  if (dir) {
    e.preventDefault();
    focusTile(neighbour(rects.value, i, dir));
  } else if (e.key === "Home") (e.preventDefault(), focusTile(0));
  else if (e.key === "End") (e.preventDefault(), focusTile(tiles.value.length - 1));
  else if (e.key === "Backspace" && trail.value.length) (e.preventDefault(), up());
}
const hint = `bless-treemap-hint`;
</script>

<template>
  <div class="bless-treemap">
    <nav v-if="trail.length" class="bless-treemap__path" :aria-label="text.path">
      <button type="button" class="bless-treemap__crumb" @click="up(0)">{{ label }}</button>
      <template v-for="(n, k) in trail" :key="n.id">
        <span aria-hidden="true">›</span>
        <button
          v-if="k < trail.length - 1"
          type="button"
          class="bless-treemap__crumb"
          @click="up(k + 1)"
        >
          {{ n.label }}
        </button>
        <span v-else class="bless-treemap__here" aria-current="location">{{ n.label }}</span>
      </template>
    </nav>
    <div
      ref="box"
      class="bless-treemap__box"
      role="group"
      :aria-label="trail.length ? trail.at(-1)!.label : label"
      :style="{ height: `${height}px` }"
    >
      <button
        v-for="(t, i) in tiles"
        :key="t.node.id"
        type="button"
        class="bless-treemap__tile"
        :class="{ 'bless-treemap__tile--group': t.node.children?.length }"
        :style="{
          left: `${t.r.x}px`,
          top: `${t.r.y}px`,
          width: `${t.r.w}px`,
          height: `${t.r.h}px`,
          '--_c': t.color,
        }"
        :tabindex="tabAt === i ? 0 : -1"
        :aria-label="t.name"
        :aria-describedby="hint"
        :title="t.big ? undefined : t.name"
        @click="open(i)"
        @focus="active = i"
        @keydown="onKey(i, $event)"
      >
        <template v-if="t.big">
          <span class="bless-treemap__name">{{ t.node.label }}</span>
          <span v-if="t.tall" class="bless-treemap__value">{{ fmt(t.v) }}</span>
        </template>
      </button>
    </div>
    <span :id="hint" hidden>{{ text.hint }}</span>
  </div>
</template>

<style>
.bless-treemap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-treemap__path {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-treemap__crumb {
  padding: 0;
  border: 0;
  background: none;
  color: var(--bless-color-accent-text);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
.bless-treemap__here {
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-treemap__box {
  position: relative;
  overflow: hidden;
}
.bless-treemap__tile {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2px;
  margin: 0;
  padding: var(--bless-space-2);
  border: 1px solid var(--bless-color-bg);
  background: color-mix(in srgb, var(--_c) 24%, var(--bless-color-surface));
  color: var(--bless-color-text);
  font: inherit;
  text-align: start;
  overflow: hidden;
  cursor: default;
}
.bless-treemap__tile--group {
  cursor: pointer;
  box-shadow: inset 3px 0 0 var(--_c);
}
.bless-treemap__tile:hover {
  background: color-mix(in srgb, var(--_c) 38%, var(--bless-color-surface));
}
.bless-treemap__tile:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
  z-index: 1;
}
.bless-treemap__name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-treemap__value {
  font-size: var(--bless-text-xs);
}
</style>
