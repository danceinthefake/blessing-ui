<template>
  <div class="bless-places">
    <label :for="`${id}-q`" class="bless-places__label">{{ text.label }}</label>
    <div class="bless-places__box">
      <svg viewBox="0 0 24 24" class="bless-places__glass" aria-hidden="true">
        <circle cx="10" cy="10" r="6" />
        <path d="M15 15l6 6" />
      </svg>
      <input
        :id="`${id}-q`"
        v-model="query"
        type="search"
        role="combobox"
        autocomplete="off"
        :placeholder="text.placeholder"
        aria-autocomplete="list"
        :aria-expanded="open && results.length > 0"
        :aria-controls="`${id}-list`"
        :aria-activedescendant="active >= 0 ? `${id}-o${active}` : undefined"
        @input="typed"
        @keydown="key"
        @blur="open = false"
      />
      <ul
        v-show="open && results.length"
        :id="`${id}-list`"
        role="listbox"
        :aria-label="text.label"
        class="bless-places__list"
      >
        <li
          v-for="(p, i) in results"
          :id="`${id}-o${i}`"
          :key="p.id"
          role="option"
          :aria-selected="i === active"
          class="bless-places__option"
          @mousedown.prevent="choose(p)"
        >
          <span class="bless-places__main">
            <strong>{{ p.name }}</strong>
            <span v-if="p.address || p.kind" class="bless-places__address">{{
              [p.kind, p.address].filter(Boolean).join(" · ")
            }}</span>
          </span>
          <span class="bless-places__dist">{{ dist(p.distance) }}</span>
        </li>
      </ul>
    </div>
    <p class="bless-places__status" role="status">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessPlaceSearch" });
const pack = useLabelPack("BlessPlaceSearch");

export interface BlessPlace {
  id: string;
  name: string;
  address?: string;
  /** from the person, in meters */
  distance?: number;
  /** for example "Cafe" or "Station" */
  kind?: string;
}

const props = withDefaults(
  defineProps<{
    /** your search: it gets the text and returns the places */
    search: (query: string) => Promise<BlessPlace[]>;
    /** the wait after the last key before a search, in milliseconds */
    delay?: number;
    minLength?: number;
    locale?: string;
    labels?: Partial<{
      label: string;
      placeholder: string;
      searching: string;
      results: (n: number) => string;
      none: string;
      failed: string;
    }>;
  }>(),
  { delay: 250, minLength: 2, locale: "en" },
);
const place = defineModel<BlessPlace | null>({ default: null });

const text = computed(() => ({
  label: "Search for a place",
  placeholder: "A name or an address",
  searching: "Searching…",
  results: (n: number) => (n === 1 ? "1 place found" : `${n} places found`),
  none: "No places found.",
  failed: "The search did not work. Try again.",
  ...pack(),
  ...props.labels,
}));
const id = useId();
const query = ref(place.value?.name ?? "");
// a place from the parent, for example a saved address, shows its name
watch(place, (p) => (query.value = p?.name ?? ""));
const results = ref<BlessPlace[]>([]);
const open = ref(false);
const active = ref(-1);
const state = ref<"idle" | "busy" | "done" | "error">("idle");
let timer: ReturnType<typeof setTimeout> | undefined;
let ask = 0;
onBeforeUnmount(() => clearTimeout(timer));

function typed() {
  clearTimeout(timer);
  active.value = -1;
  const q = query.value.trim();
  if (q.length < props.minLength) {
    results.value = [];
    open.value = false;
    state.value = "idle";
    return;
  }
  timer = setTimeout(async () => {
    const mine = ++ask;
    state.value = "busy";
    try {
      const found = await props.search(q);
      // an older search that ends late must not replace a newer one
      if (mine !== ask) return;
      results.value = found;
      state.value = "done";
      open.value = true;
    } catch {
      if (mine === ask) state.value = "error";
    }
  }, props.delay);
}
function choose(p: BlessPlace) {
  place.value = p;
  query.value = p.name;
  open.value = false;
  active.value = -1;
}
function key(e: KeyboardEvent) {
  const n = results.value.length;
  if (e.key === "ArrowDown" && n) {
    e.preventDefault();
    open.value = true;
    active.value = (active.value + 1) % n;
  } else if (e.key === "ArrowUp" && n) {
    e.preventDefault();
    open.value = true;
    active.value = (active.value - 1 + n) % n;
  } else if (e.key === "Enter" && open.value && active.value >= 0) {
    e.preventDefault();
    choose(results.value[active.value]!);
  } else if (e.key === "Escape") open.value = false;
}
function dist(m?: number) {
  if (m == null) return "";
  const km = m >= 1000;
  return new Intl.NumberFormat(props.locale, {
    style: "unit",
    unit: km ? "kilometer" : "meter",
    maximumFractionDigits: km ? 1 : 0,
  }).format(km ? m / 1000 : m);
}
const status = computed(() =>
  state.value === "busy"
    ? text.value.searching
    : state.value === "error"
      ? text.value.failed
      : state.value === "done"
        ? results.value.length
          ? text.value.results(results.value.length)
          : text.value.none
        : "",
);
</script>

<style>
.bless-places {
  position: relative;
  display: grid;
  gap: var(--bless-space-1);
  max-inline-size: 28rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-places__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-places__box {
  position: relative;
}
.bless-places__glass {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: var(--bless-space-3);
  inline-size: 1.1rem;
  block-size: 1.1rem;
  translate: 0 -50%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
.bless-places__box input {
  inline-size: 100%;
  min-block-size: 2.75rem;
  box-sizing: border-box;
  padding: 0 var(--bless-space-3) 0 2.5rem;
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-places__box input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-places__list {
  position: absolute;
  inset-block-start: 100%;
  inset-inline: 0;
  z-index: 10;
  max-block-size: 18rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
}
.bless-places__option {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  cursor: pointer;
}
.bless-places__option + .bless-places__option {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-places__option[aria-selected="true"],
.bless-places__option:hover {
  background: var(--bless-color-surface-2);
  box-shadow: inset 4px 0 0 var(--bless-color-accent);
}
.bless-places__main {
  display: grid;
  flex: 1;
  min-inline-size: 0;
}
.bless-places__address {
  overflow: hidden;
  font-size: var(--bless-text-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-places__dist {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bless-places__status {
  min-block-size: 1.25rem;
  margin: 0;
  font-size: var(--bless-text-xs);
}
</style>
