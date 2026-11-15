<script setup lang="ts">
import BlessTooltip from "./BlessTooltip.vue";
import type { Placement } from "../composables/useFloating";

defineOptions({ name: "BlessGlossary" });

withDefaults(
  defineProps<{
    /** what the term means, in a sentence or two */
    definition: string;
    /** the word to define in the tip, if it differs from the text in the line */
    term?: string;
    placement?: Placement;
  }>(),
  { placement: "top" },
);
</script>

<template>
  <BlessTooltip :placement :delay="200">
    <button type="button" class="bless-glossary"><slot /></button>
    <template #content>
      <span class="bless-glossary__tip">
        <strong v-if="term" class="bless-glossary__term">{{ term }}</strong>
        <span>{{ definition }}</span>
      </span>
    </template>
  </BlessTooltip>
</template>

<style>
/* a term looks like the text around it, with a dotted line under it */
.bless-glossary {
  display: inline;
  padding: 0;
  border: 0;
  border-block-end: 1.5px dotted currentColor;
  background: none;
  color: inherit;
  font: inherit;
  line-height: inherit;
  text-align: inherit;
  cursor: help;
}
.bless-glossary:hover {
  border-block-end-style: solid;
}
.bless-glossary:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-glossary__tip {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-inline-size: 18rem;
  text-align: start;
}
.bless-glossary__term {
  font-weight: var(--bless-font-weight-bold);
}
</style>
