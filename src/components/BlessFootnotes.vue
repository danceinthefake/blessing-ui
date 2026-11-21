<template>
  <section class="bless-footnotes" :aria-labelledby="`${id}-title`">
    <p :id="`${id}-title`" class="bless-footnotes__title">{{ text.title }}</p>
    <ol class="bless-footnotes__list">
      <li v-for="(note, i) in notes" :id="`${id}-${i + 1}`" :key="i" class="bless-footnotes__note">
        <span>{{ note }}</span>
        <a
          class="bless-footnotes__back"
          :href="`#${id}-ref-${i + 1}`"
          :aria-label="text.back(i + 1)"
          >↩</a
        >
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessFootnotes" });
const pack = useLabelPack("BlessFootnotes");

const props = withDefaults(
  defineProps<{
    /** the notes, in the order of their marks; note 1 is the first */
    notes: string[];
    /** the start of the ids: note 2 is `<id>-2`, and its mark is `<id>-ref-2`. Use the same id on each `BlessFootnoteRef`. */
    id?: string;
    labels?: Partial<{ title: string; back: (n: number) => string }>;
  }>(),
  { id: "fn" },
);

const text = computed(() => ({
  title: "Notes",
  back: (n: number) => `Back to the text of note ${n}`,
  ...pack(),
  ...props.labels,
}));
</script>

<style>
.bless-footnotes {
  margin-block-start: var(--bless-space-6);
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-footnotes__title {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-footnotes__list {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding-inline-start: var(--bless-space-6);
  list-style: decimal;
}
.bless-footnotes__note {
  padding-inline-start: var(--bless-space-1);
  line-height: 1.5;
  scroll-margin-block: var(--bless-space-8);
}
/* the note that a mark links to lights up */
.bless-footnotes__note:target {
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
}
.bless-footnotes__back {
  margin-inline-start: var(--bless-space-1);
  color: var(--bless-color-text);
  text-decoration: none;
}
.bless-footnotes__back:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
