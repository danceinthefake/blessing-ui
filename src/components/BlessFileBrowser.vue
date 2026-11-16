<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessFileBrowser" });
const pack = useLabelPack("BlessFileBrowser");

export interface BlessFileItem {
  id: string;
  name: string;
  folder?: boolean;
  /** in bytes */
  size?: number;
  /** a date as text or milliseconds since 1970 */
  modified?: string | number;
}

const props = withDefaults(
  defineProps<{
    items: BlessFileItem[];
    /** the folders from the top down to this one; the last is the current folder */
    path?: { id: string; label: string }[];
    locale?: string;
    labels?: Partial<{
      path: string;
      view: string;
      grid: string;
      list: string;
      name: string;
      modified: string;
      size: string;
      folder: string;
      empty: string;
      items: (n: number) => string;
    }>;
  }>(),
  { path: () => [], locale: "en" },
);
const view = defineModel<"grid" | "list">("view", { default: "grid" });
const emit = defineEmits<{ open: [item: BlessFileItem]; navigate: [id: string] }>();

const text = computed(() => ({
  path: "Folder path",
  view: "View",
  grid: "Grid",
  list: "List",
  name: "Name",
  modified: "Modified",
  size: "Size",
  folder: "Folder",
  empty: "This folder is empty.",
  items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
  ...pack(),
  ...props.labels,
}));
const sorted = computed(() =>
  [...props.items].sort(
    (a, b) =>
      Number(!!b.folder) - Number(!!a.folder) ||
      a.name.localeCompare(b.name, props.locale, { numeric: true }),
  ),
);
const ext = (n: string) => (n.includes(".") ? n.split(".").pop()!.slice(0, 4).toUpperCase() : "");
function size(b?: number) {
  if (b == null) return "";
  const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;
  let i = 0;
  while (b >= 1000 && i < units.length - 1) ((b /= 1000), i++);
  return new Intl.NumberFormat(props.locale, {
    style: "unit",
    unit: units[i],
    unitDisplay: "short",
    maximumFractionDigits: i ? 1 : 0,
  }).format(b);
}
const date = computed(
  () => new Intl.DateTimeFormat(props.locale, { dateStyle: "medium", timeZone: "UTC" }),
);
const when = (m?: string | number) => (m == null ? "" : date.value.format(new Date(m)));
</script>

<template>
  <div class="bless-files">
    <div class="bless-files__bar">
      <nav :aria-label="text.path" class="bless-files__path">
        <ol role="list">
          <li v-for="(p, i) in path" :key="p.id">
            <span v-if="i === path.length - 1" aria-current="page">{{ p.label }}</span>
            <button v-else type="button" @click="emit('navigate', p.id)">{{ p.label }}</button>
          </li>
        </ol>
      </nav>
      <div class="bless-files__views" role="group" :aria-label="text.view">
        <button type="button" :aria-pressed="view === 'grid'" @click="view = 'grid'">
          <span aria-hidden="true">▦</span> {{ text.grid }}
        </button>
        <button type="button" :aria-pressed="view === 'list'" @click="view = 'list'">
          <span aria-hidden="true">☰</span> {{ text.list }}
        </button>
      </div>
    </div>
    <p class="bless-files__count">{{ items.length ? text.items(items.length) : text.empty }}</p>
    <ul v-if="view === 'grid'" class="bless-files__grid" role="list">
      <li v-for="f in sorted" :key="f.id">
        <button type="button" class="bless-files__tile" @click="emit('open', f)">
          <svg viewBox="0 0 48 40" class="bless-files__icon" aria-hidden="true">
            <path v-if="f.folder" d="M2 6h16l4 5h24v27H2z" class="is-folder" />
            <template v-else>
              <path d="M10 1h20l9 9v29H10z" class="is-file" />
              <text x="24.5" y="30" text-anchor="middle">{{ ext(f.name) }}</text>
            </template>
          </svg>
          <span class="bless-files__name">{{ f.name }}</span>
          <span class="bless-files__meta">{{ f.folder ? text.folder : size(f.size) }}</span>
        </button>
      </li>
    </ul>
    <table v-else-if="items.length" class="bless-files__table">
      <thead>
        <tr>
          <th scope="col">{{ text.name }}</th>
          <th scope="col">{{ text.modified }}</th>
          <th scope="col" class="is-num">{{ text.size }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in sorted" :key="f.id">
          <th scope="row">
            <button type="button" @click="emit('open', f)">
              <span aria-hidden="true" class="bless-files__mark">{{ f.folder ? "▸" : "·" }}</span>
              {{ f.name }}
            </button>
          </th>
          <td>{{ when(f.modified) }}</td>
          <td class="is-num">{{ f.folder ? text.folder : size(f.size) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.bless-files {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-files button {
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-files button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-files__bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-files__path ol {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-files__path li + li::before {
  content: "/";
  padding-inline: var(--bless-space-2);
  color: var(--bless-color-text-muted);
}
.bless-files__path button {
  padding: 0;
  border: 0;
  background: none;
  text-decoration: underline;
}
.bless-files__path [aria-current] {
  font-weight: var(--bless-font-weight-bold);
}
.bless-files__views {
  display: flex;
}
.bless-files__views button {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.bless-files__views button + button {
  border-inline-start: 0;
}
.bless-files__views button[aria-pressed="true"] {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-files__count {
  margin: 0;
  font-size: var(--bless-text-xs);
}
.bless-files__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-files__tile {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-1);
  inline-size: 100%;
  block-size: 100%;
  padding: var(--bless-space-3) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  text-align: center;
}
.bless-files__tile:hover {
  background: var(--bless-color-surface-2);
}
.bless-files__icon {
  inline-size: 3rem;
}
.bless-files__icon .is-folder {
  fill: var(--bless-color-accent);
}
.bless-files__icon .is-file {
  fill: var(--bless-color-bg);
  stroke: var(--bless-color-text);
  stroke-width: 2;
}
.bless-files__icon text {
  fill: var(--bless-color-text);
  font-size: 9px;
  font-weight: 700;
}
.bless-files__name {
  overflow-wrap: anywhere;
}
.bless-files__meta {
  font-size: var(--bless-text-xs);
}
.bless-files__table {
  inline-size: 100%;
  border-collapse: collapse;
}
.bless-files__table :is(th, td) {
  padding: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: start;
  font-variant-numeric: tabular-nums;
}
.bless-files__table thead th {
  font-size: var(--bless-text-xs);
}
.bless-files__table tbody th {
  font-weight: var(--bless-font-weight-normal);
}
.bless-files__table tbody th button {
  padding: 0;
  border: 0;
  background: none;
  text-align: start;
}
.bless-files__table .is-num {
  text-align: end;
}
.bless-files__mark {
  display: inline-block;
  inline-size: 1em;
}
</style>
