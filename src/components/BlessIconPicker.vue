<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessInput from "./BlessInput.vue";

defineOptions({ name: "BlessIconPicker" });
const pack = useLabelPack("BlessIconPicker");

export interface BlessPickIcon {
  name: string;
  /** the path data of the icon; a list makes several paths */
  path: string | string[];
  /** more words to search by */
  keywords?: string[];
}

const props = withDefaults(
  defineProps<{
    icons: BlessPickIcon[];
    /** the box of the path data */
    viewBox?: string;
    /** draw the paths as lines, not filled shapes */
    stroke?: boolean;
    labels?: Partial<{ search: string; group: string; none: string; count: (n: number) => string }>;
  }>(),
  { viewBox: "0 0 24 24" },
);
/** the name of the chosen icon */
const model = defineModel<string>();

const text = computed(() => ({
  search: "Search icons",
  group: "Icons",
  none: "No icon matches",
  count: (n: number) => `${n} icons`,
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const query = ref("");
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q
    ? props.icons.filter((i) =>
        [i.name, ...(i.keywords ?? [])].some((w) => w.toLowerCase().includes(q)),
      )
    : props.icons;
});
const paths = (i: BlessPickIcon) => (Array.isArray(i.path) ? i.path : [i.path]);
</script>

<template>
  <div class="bless-iconpick">
    <BlessInput
      v-model="query"
      type="search"
      size="sm"
      :aria-label="text.search"
      :placeholder="text.search"
    />
    <p class="bless-iconpick__count" role="status">
      {{ shown.length ? text.count(shown.length) : text.none }}
    </p>
    <div class="bless-iconpick__grid" role="radiogroup" :aria-label="text.group">
      <label v-for="i in shown" :key="i.name" class="bless-iconpick__icon" :title="i.name">
        <input
          type="radio"
          class="bless-iconpick__input"
          :name="`${uid}-icon`"
          :value="i.name"
          :checked="model === i.name"
          :aria-label="i.name"
          @change="model = i.name"
        />
        <svg
          :viewBox
          class="bless-iconpick__svg"
          :class="{ 'is-stroke': stroke }"
          aria-hidden="true"
        >
          <path v-for="(d, k) in paths(i)" :key="k" :d />
        </svg>
      </label>
    </div>
  </div>
</template>

<style>
.bless-iconpick {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-iconpick__count {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-iconpick__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.75rem, 1fr));
  gap: var(--bless-space-1);
  max-block-size: 16rem;
  overflow-y: auto;
}
.bless-iconpick__icon {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: var(--bless-border-width) solid transparent;
  cursor: pointer;
}
.bless-iconpick__icon:hover {
  background: var(--bless-color-surface-2);
}
.bless-iconpick__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.bless-iconpick__svg {
  inline-size: 1.4rem;
  block-size: 1.4rem;
  fill: currentColor;
}
.bless-iconpick__svg.is-stroke {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
/* the chosen icon is a filled box, not only a tint */
.bless-iconpick__icon:has(:checked) {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-iconpick__icon:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
