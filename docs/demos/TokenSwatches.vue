<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

// every colour token, grouped; the swatch paints var(--bless-color-*) so it follows theme and palette
const groups: [string, string[]][] = [
  ["Greys", ["text", "text-muted", "bg", "surface", "surface-2", "watermark", "border", "rule"]],
  ["Accent family", ["accent", "accent-text", "accent-soft", "accent-2", "badge"]],
  ["Status", ["danger", "danger-text", "warning", "success", "info", "info-text"]],
  ["On a fill", ["on-accent", "on-text", "on-light"]],
  ["Chart", ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]],
  ["Overlay", ["backdrop", "media-bg"]],
];

// resolved values, re-read when the theme or palette attribute on <html> changes
const values = ref<Record<string, string>>({});
function read() {
  const cs = getComputedStyle(document.documentElement);
  values.value = Object.fromEntries(
    groups.flatMap(([, names]) =>
      names.map((n) => [n, cs.getPropertyValue(`--bless-color-${n}`).trim()]),
    ),
  );
}
let mo: MutationObserver | undefined;
let mql: MediaQueryList | undefined;
onMounted(() => {
  read();
  mo = new MutationObserver(read);
  mo.observe(document.documentElement, { attributes: true });
  mql = matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", read);
});
onBeforeUnmount(() => {
  mo?.disconnect();
  mql?.removeEventListener("change", read);
});
</script>

<template>
  <div class="swatches">
    <section v-for="[title, names] in groups" :key="title">
      <h4 class="swatches__title">{{ title }}</h4>
      <ul class="swatches__grid">
        <li v-for="n in names" :key="n" class="swatches__item">
          <span class="swatches__chip" :style="{ background: `var(--bless-color-${n})` }" />
          <code>{{ n }}</code>
          <small>{{ values[n] }}</small>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.swatches {
  display: grid;
  gap: var(--bless-space-4);
  width: 100%;
}
.swatches__title {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.swatches__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.swatches__item {
  display: grid;
  gap: 2px;
  margin: 0;
  font-size: var(--bless-text-xs);
}
.swatches__chip {
  height: 36px;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.swatches__item small {
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
