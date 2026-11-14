<script setup lang="ts">
import { computed } from "vue";
import { highlightRanges } from "./highlight";

defineOptions({ name: "BlessHighlight" });

const props = defineProps<{
  text: string;
  /** a search: its words are marked; or a list of terms, each marked as written */
  query?: string | string[];
}>();

const parts = computed(() => {
  const terms = Array.isArray(props.query) ? props.query : (props.query ?? "").split(/\s+/);
  const out: { text: string; mark: boolean }[] = [];
  let at = 0;
  for (const [a, b] of highlightRanges(props.text, terms)) {
    if (a > at) out.push({ text: props.text.slice(at, a), mark: false });
    out.push({ text: props.text.slice(a, b), mark: true });
    at = b;
  }
  if (at < props.text.length) out.push({ text: props.text.slice(at), mark: false });
  return out;
});
</script>

<template>
  <span class="bless-highlight"
    ><template v-for="(p, i) in parts" :key="i"
      ><mark v-if="p.mark" class="bless-highlight__mark">{{ p.text }}</mark
      ><template v-else>{{ p.text }}</template></template
    ></span
  >
</template>

<style>
.bless-highlight__mark {
  /* a light tint of the accent under the text color: 4.5:1 in both themes */
  background: color-mix(in srgb, var(--bless-color-accent) 25%, transparent);
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
}
</style>
