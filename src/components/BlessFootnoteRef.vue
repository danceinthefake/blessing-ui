<template>
  <sup class="bless-fnref">
    <a :id="`${id}-ref-${n}`" :href="`#${id}-${n}`" :aria-label="text.note(n)">{{ n }}</a>
  </sup>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessFootnoteRef" });
const pack = useLabelPack("BlessFootnoteRef");

const props = withDefaults(
  defineProps<{
    /** the number of the note, from 1 */
    n: number;
    /** the same id as on `BlessFootnotes` */
    id?: string;
    labels?: Partial<{ note: (n: number) => string }>;
  }>(),
  { id: "fn" },
);
const text = computed(() => ({ note: (n: number) => `Note ${n}`, ...pack(), ...props.labels }));
</script>

<style>
.bless-fnref {
  line-height: 0;
}
.bless-fnref a {
  padding-inline: 0.15em;
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
  scroll-margin-block: var(--bless-space-8);
}
.bless-fnref a:hover {
  text-decoration: underline;
}
.bless-fnref a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-fnref a:target {
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
}
</style>
