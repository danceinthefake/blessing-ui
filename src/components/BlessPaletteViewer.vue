<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { contrastRatio } from "../composables/contrast";
import { copyText } from "../composables/copyText";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessPaletteViewer" });
const pack = useLabelPack("BlessPaletteViewer");

export interface BlessColorPalette {
  name: string;
  /** the shades, light to dark, each with a label such as `500` and a hex value */
  shades: { label: string; value: string }[];
}

const props = defineProps<{
  palettes: BlessColorPalette[];
  labels?: Partial<{
    copy: (value: string) => string;
    copied: (value: string) => string;
    onWhite: string;
    onBlack: string;
  }>;
}>();

const text = computed(() => ({
  copy: (v: string) => `Copy ${v}`,
  copied: (v: string) => `${v} copied`,
  onWhite: "on white",
  onBlack: "on black",
  ...pack(),
  ...props.labels,
}));
const ratio = (v: string, on: string) => contrastRatio(v, on) ?? 1;
const cut = (r: number) => (Math.floor(r * 10) / 10).toFixed(1);
// the label on a swatch takes black or white, whichever reads better
const ink = (v: string) => (ratio(v, "#000") >= ratio(v, "#fff") ? "#000" : "#fff");
const status = ref("");
const last = ref<string>();
let timer: ReturnType<typeof setTimeout> | undefined;
async function copy(v: string) {
  await copyText(v);
  last.value = v;
  status.value = text.value.copied(v);
  clearTimeout(timer);
  timer = setTimeout(() => (last.value = undefined), 1500);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="bless-palettes">
    <section
      v-for="p in palettes"
      :key="p.name"
      class="bless-palettes__palette"
      :aria-label="p.name"
    >
      <p class="bless-palettes__name">{{ p.name }}</p>
      <ul class="bless-palettes__shades">
        <li v-for="s in p.shades" :key="s.label" class="bless-palettes__shade">
          <button
            type="button"
            class="bless-palettes__swatch"
            :style="{ background: s.value, color: ink(s.value) }"
            :aria-label="text.copy(`${p.name} ${s.label}, ${s.value}`)"
            @click="copy(s.value)"
          >
            <span aria-hidden="true">{{ s.label }}</span>
            <span class="bless-palettes__copied" aria-hidden="true">{{
              last === s.value ? "✓" : ""
            }}</span>
          </button>
          <code class="bless-palettes__value">{{ s.value }}</code>
          <span class="bless-palettes__ratio">
            {{ cut(ratio(s.value, "#fff")) }} {{ text.onWhite
            }}<b v-if="ratio(s.value, '#fff') >= 4.5"> AA</b>
          </span>
          <span class="bless-palettes__ratio">
            {{ cut(ratio(s.value, "#000")) }} {{ text.onBlack
            }}<b v-if="ratio(s.value, '#000') >= 4.5"> AA</b>
          </span>
        </li>
      </ul>
    </section>
    <span class="bless-sr" role="status">{{ status }}</span>
  </div>
</template>

<style>
.bless-palettes {
  display: grid;
  gap: var(--bless-space-6);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-palettes__name {
  margin: 0 0 var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-palettes__shades {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-palettes__shade {
  display: grid;
  gap: 2px;
}
.bless-palettes__swatch {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  block-size: 4rem;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid
    color-mix(in srgb, var(--bless-color-text) 12%, transparent);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: copy;
}
.bless-palettes__swatch:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-palettes__value {
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-xs);
}
.bless-palettes__ratio {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-palettes__ratio b {
  color: var(--bless-color-text);
}
</style>
