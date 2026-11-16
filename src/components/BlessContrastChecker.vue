<script setup lang="ts">
import { computed } from "vue";
import { contrastRatio, hexToRgb, wcagLevels } from "../composables/contrast";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessContrastChecker" });
const pack = useLabelPack("BlessContrastChecker");

const props = defineProps<{
  labels?: Partial<{
    text: string;
    background: string;
    swap: string;
    ratio: string;
    sample: string;
    pass: string;
    fail: string;
    invalid: string;
    aaText: string;
    aaLarge: string;
    aaaText: string;
    aaaLarge: string;
    ui: string;
  }>;
}>();
const fg = defineModel<string>("text", { default: "#3f4245" });
const bg = defineModel<string>("background", { default: "#f4f4f5" });

const text = computed(() => ({
  text: "Text color",
  background: "Background",
  swap: "Swap the colors",
  ratio: "Contrast ratio",
  sample: "The quick brown fox jumps over the lazy dog.",
  pass: "Pass",
  fail: "Fail",
  invalid: "Write the colors as hex, such as #3f4245.",
  aaText: "AA, normal text",
  aaLarge: "AA, large text",
  aaaText: "AAA, normal text",
  aaaLarge: "AAA, large text",
  ui: "Parts of the interface",
  ...pack(),
  ...props.labels,
}));
const ratio = computed(() => contrastRatio(fg.value, bg.value));
const checks = computed(() => {
  if (ratio.value === undefined) return [];
  const l = wcagLevels(ratio.value);
  return (["aaText", "aaLarge", "aaaText", "aaaLarge", "ui"] as const).map((k) => ({
    k,
    label: text.value[k],
    ok: l[k],
  }));
});
const shown = computed(() =>
  ratio.value === undefined ? "–" : `${(Math.floor(ratio.value * 100) / 100).toFixed(2)}:1`,
);
// the color input needs #rrggbb; a short form is spelled out for it
const full = (h: string) => {
  const rgb = hexToRgb(h);
  return rgb ? `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}` : "#000000";
};
const swap = () => ([fg.value, bg.value] = [bg.value, fg.value]);
</script>

<template>
  <div class="bless-contrast">
    <div class="bless-contrast__inputs">
      <label v-for="f in ['text', 'background'] as const" :key="f" class="bless-contrast__field">
        <span class="bless-contrast__label">{{ text[f] }}</span>
        <span class="bless-contrast__pair">
          <input
            type="color"
            class="bless-contrast__swatch"
            :value="full(f === 'text' ? fg : bg)"
            :aria-label="text[f]"
            @input="
              f === 'text'
                ? (fg = ($event.target as HTMLInputElement).value)
                : (bg = ($event.target as HTMLInputElement).value)
            "
          />
          <input
            class="bless-contrast__hex"
            :aria-label="`${text[f]}, hex`"
            :value="f === 'text' ? fg : bg"
            spellcheck="false"
            @input="
              f === 'text'
                ? (fg = ($event.target as HTMLInputElement).value)
                : (bg = ($event.target as HTMLInputElement).value)
            "
          />
        </span>
      </label>
      <button
        type="button"
        class="bless-contrast__swap"
        :aria-label="text.swap"
        :title="text.swap"
        @click="swap"
      >
        ⇄
      </button>
    </div>
    <div
      class="bless-contrast__sample"
      :style="ratio === undefined ? undefined : { color: fg, background: bg }"
    >
      <strong class="bless-contrast__big">Aa</strong>
      <span>{{ text.sample }}</span>
    </div>
    <p class="bless-contrast__ratio" role="status">
      <span>{{ text.ratio }}</span>
      <strong>{{ shown }}</strong>
    </p>
    <p v-if="ratio === undefined" class="bless-contrast__invalid">{{ text.invalid }}</p>
    <ul v-else class="bless-contrast__checks">
      <li v-for="c in checks" :key="c.k" :class="c.ok ? 'is-pass' : 'is-fail'">
        <span class="bless-contrast__mark" aria-hidden="true">{{ c.ok ? "✓" : "✕" }}</span>
        {{ c.label }}: <strong>{{ c.ok ? text.pass : text.fail }}</strong>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-contrast {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 30rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-contrast__inputs {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--bless-space-3);
}
.bless-contrast__field {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-contrast__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-contrast__pair {
  display: flex;
  gap: var(--bless-space-1);
}
.bless-contrast__swatch {
  inline-size: 2.4rem;
  block-size: 2.4rem;
  padding: 2px;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  cursor: pointer;
}
.bless-contrast__hex {
  inline-size: 7rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-sm);
}
.bless-contrast__swap {
  inline-size: 2.4rem;
  block-size: 2.4rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
}
.bless-contrast__swatch:focus-visible,
.bless-contrast__hex:focus-visible,
.bless-contrast__swap:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-contrast__sample {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-contrast__big {
  font-size: var(--bless-text-xl);
}
.bless-contrast__ratio {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0;
}
.bless-contrast__ratio strong {
  font-size: var(--bless-text-xl);
  font-variant-numeric: tabular-nums;
}
.bless-contrast__invalid {
  margin: 0;
  color: var(--bless-color-danger-text);
}
.bless-contrast__checks {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-contrast__checks li {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
/* pass and fail have a mark and a word, not only a color */
.bless-contrast__mark {
  display: inline-grid;
  place-items: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.is-pass .bless-contrast__mark {
  background: var(--bless-color-success);
  color: var(--bless-color-on-light);
}
.is-fail .bless-contrast__mark {
  background: var(--bless-color-danger);
  color: var(--bless-color-on-accent);
}
</style>
