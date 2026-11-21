<template>
  <section ref="root" class="bless-typescale" :aria-label="text.title">
    <div v-for="(s, i) in list" :key="s.name" class="bless-typescale__row">
      <div class="bless-typescale__meta">
        <code class="bless-typescale__name">{{ s.name }}</code>
        <span v-if="measured[i]" class="bless-typescale__px">
          {{ text.size }} {{ measured[i]!.px }} · {{ text.line }} {{ measured[i]!.lh }}
        </span>
      </div>
      <p
        class="bless-typescale__sample"
        :style="{ fontSize: s.size, lineHeight: s.lineHeight, fontWeight: s.weight }"
      >
        {{ sample }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessTypeScale" });
const pack = useLabelPack("BlessTypeScale");

export interface BlessTypeStep {
  /** the name, for example `--bless-text-lg` or "Heading 2" */
  name: string;
  /** any CSS size, for example `var(--bless-text-lg)` or `1.25rem` */
  size: string;
  lineHeight?: string;
  weight?: number | string;
}

/** the text sizes of the library, smallest first */
const TOKENS: BlessTypeStep[] = ["2xs", "xs", "sm", "md", "lg", "xl", "headline", "display"].map(
  (t) => ({
    name: `--bless-text-${t}`,
    size: `var(--bless-text-${t})`,
    lineHeight:
      t === "headline" || t === "display"
        ? "var(--bless-leading-none)"
        : "var(--bless-leading-tight)",
  }),
);

const props = withDefaults(
  defineProps<{
    /** the steps to show; default: the text sizes of the library */
    steps?: BlessTypeStep[];
    /** the words to show in each size */
    sample?: string;
    labels?: Partial<{ title: string; size: string; line: string }>;
  }>(),
  { sample: "Home Studio, real sound" },
);

const text = computed(() => ({
  title: "Type scale",
  size: "size",
  line: "line",
  ...pack(),
  ...props.labels,
}));
const list = computed(() => props.steps ?? TOKENS);
// the real size in pixels is known only in the browser, and clamp() sizes change with the window
const measured = ref<{ px: string; lh: string }[]>([]);
const root = ref<HTMLElement>();
function measure() {
  measured.value = [
    ...(root.value?.querySelectorAll<HTMLElement>(".bless-typescale__sample") ?? []),
  ].map((el) => {
    const s = getComputedStyle(el);
    const px = parseFloat(s.fontSize);
    const lh = parseFloat(s.lineHeight);
    return {
      px: `${Math.round(px * 10) / 10}px`,
      lh: Number.isFinite(lh) ? `${Math.round(lh * 10) / 10}px` : s.lineHeight,
    };
  });
}
onMounted(() => {
  measure();
  window.addEventListener("resize", measure, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("resize", measure));
</script>

<style>
.bless-typescale {
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-typescale__row {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  align-items: baseline;
  gap: var(--bless-space-4);
  padding-block: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-typescale__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bless-typescale__name {
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-xs);
}
.bless-typescale__px {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-typescale__sample {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 40rem) {
  .bless-typescale__row {
    grid-template-columns: 1fr;
    gap: var(--bless-space-1);
  }
}
</style>
