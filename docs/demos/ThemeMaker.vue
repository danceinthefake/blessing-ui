<script setup lang="ts">
import { BlessCodeBlock, BlessColorPicker, BlessField, BlessInput, contrastRatio } from "blessing-ui";
import { useData } from "vitepress";
import { computed, onMounted, ref } from "vue";
import { css, derive, grays, onGrays } from "../.vitepress/theme/palette";
import PaletteRetint from "./PaletteRetint.vue";

const { isDark, lang } = useData();
const id = computed(() => lang.value.startsWith("id"));
const t = computed(() =>
  id.value
    ? {
        petal: "Warna kelopak",
        name: "Nama palet",
        nameHelp: "Nilai atribut data-palette.",
        checks: "Kontras",
        white: "Teks putih pada accent",
        text: "accent-text pada bg dan surface, terang",
        dark: "accent-text pada bg dan surface, gelap",
        chart: "chart-1 pada bg dan surface",
        preview: "Pratinjau",
      }
    : {
        petal: "Petal color",
        name: "Palette name",
        nameHelp: "The value of the data-palette attribute.",
        checks: "Contrast",
        white: "White text on accent",
        text: "accent-text on bg and surface, light",
        dark: "accent-text on bg and surface, dark",
        chart: "chart-1 on bg and surface",
        preview: "Preview",
      },
);

const petals = [
  { value: "#e85078", label: "Megumi" },
  { value: "#e03028", label: "Utaha" },
  { value: "#4090d0", label: "Izumi" },
  { value: "#b878b0", label: "Michiru" },
  { value: "#c8e018", label: "Eriri" },
  { value: "#5870f8", label: "Tomoya" },
];
const petal = ref("#2a9d8f");
const name = ref("mine");
const slug = computed(() => name.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") || "mine");
const p = computed(() => derive(petal.value));
const code = computed(() => css(slug.value, p.value));
// the preview follows the site theme, so it takes the dark text cut on dark.
// The server renders light, so read the theme only after mount (no hydration mismatch).
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const vars = computed(() => ({
  "--bless-color-accent": p.value.accent,
  "--bless-color-accent-text": mounted.value && isDark.value ? p.value.dark : p.value["accent-text"],
  "--bless-color-accent-soft": p.value["accent-soft"],
  "--bless-color-accent-2": p.value["accent-2"],
  "--bless-color-badge": p.value.badge,
  "--bless-color-chart-1": p.value["chart-1"],
}));
const checks = computed(() => [
  { label: t.value.white, ratio: contrastRatio(p.value.accent, "#ffffff")!, min: 4.5 },
  { label: t.value.text, ratio: onGrays(p.value["accent-text"], grays.light), min: 4.5 },
  { label: t.value.dark, ratio: onGrays(p.value.dark, grays.dark), min: 4.5 },
  { label: t.value.chart, ratio: onGrays(p.value["chart-1"], grays.light), min: 3 },
]);
</script>

<template>
  <div class="maker">
    <div class="maker__inputs">
      <BlessField :label="t.petal">
        <BlessColorPicker v-model="petal" :swatches="petals" />
      </BlessField>
      <BlessField :label="t.name" :description="t.nameHelp">
        <BlessInput v-model="name" />
      </BlessField>
    </div>

    <section class="maker__preview" :style="vars" :aria-label="t.preview">
      <PaletteRetint />
    </section>

    <div>
      <p class="maker__head">{{ t.checks }}</p>
      <ul class="maker__checks">
        <li v-for="c in checks" :key="c.label">
          <span>{{ c.label }}</span>
          <span class="maker__ratio">{{ c.ratio.toFixed(2) }}:1 {{ c.ratio >= c.min ? "✓" : "✗" }}</span>
        </li>
      </ul>
    </div>

    <BlessCodeBlock :code lang="css" filename="palette.css" copy />
  </div>
</template>

<style scoped>
.maker {
  display: grid;
  gap: var(--bless-space-5);
}
.maker__inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--bless-space-4);
}
.maker__preview {
  padding: var(--bless-space-4);
  border: 1px solid var(--bless-color-border);
  min-width: 0;
  /* the docs theme resolves these on :root; resolve them again here so links take the new palette */
  --vp-c-brand-1: var(--bless-color-accent-text);
  --vp-c-brand-2: var(--bless-color-accent-2);
  --vp-c-brand-3: var(--bless-color-accent);
}
.maker__preview :deep(.row) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.maker__head {
  margin: 0 0 var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
}
.maker__checks {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--bless-space-1);
}
.maker__checks li {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-3);
  border-bottom: 1px solid var(--bless-color-border);
  padding-block: var(--bless-space-1);
}
.maker__ratio {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
