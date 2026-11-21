<template>
  <div class="bless-query">
    <BlessQueryGroup v-model="model" :fields :text :depth="1" :max-depth :disabled />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessQueryGroup from "./BlessQueryGroup.vue";
import type { BlessQueryField, BlessQueryGroup as Group } from "./query";

defineOptions({ name: "BlessQueryBuilder" });
const pack = useLabelPack("BlessQueryBuilder");

const props = withDefaults(
  defineProps<{
    /** what people can filter by */
    fields: BlessQueryField[];
    /** how deep groups can go; 1 allows no groups inside the top one */
    maxDepth?: number;
    disabled?: boolean;
    labels?: Partial<{
      group: string;
      match: string;
      all: string;
      any: string;
      field: string;
      op: string;
      value: string;
      addRule: string;
      addGroup: string;
      remove: string;
      removeGroup: string;
      eq: string;
      neq: string;
      contains: string;
      starts: string;
      lt: string;
      lte: string;
      gt: string;
      gte: string;
      empty: string;
      notEmpty: string;
      before: string;
      onOrBefore: string;
      after: string;
      onOrAfter: string;
    }>;
  }>(),
  { maxDepth: 2 },
);
/** the rules as plain data; turn it into your query on the server */
const model = defineModel<Group>({ default: () => ({ match: "all", rules: [] }) });

const text = computed(() => ({
  group: "Rules",
  match: "Match",
  all: "All of these rules",
  any: "Any of these rules",
  field: "Field",
  op: "Operator",
  value: "Value",
  addRule: "Add rule",
  addGroup: "Add group",
  remove: "Remove rule",
  removeGroup: "Remove group",
  eq: "is",
  neq: "is not",
  contains: "contains",
  starts: "starts with",
  lt: "is less than",
  lte: "is at most",
  gt: "is more than",
  gte: "is at least",
  empty: "is empty",
  notEmpty: "is not empty",
  before: "is before",
  onOrBefore: "is on or before",
  after: "is after",
  onOrAfter: "is on or after",
  ...(pack() as Record<string, string>),
  ...props.labels,
}));
</script>

<style>
.bless-query {
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-query__group {
  display: grid;
  gap: var(--bless-space-2);
}
/* a group inside a group: a rule on its start edge shows which rules it holds */
.bless-query__item > .bless-query__group {
  padding: var(--bless-space-2) 0 var(--bless-space-2) var(--bless-space-3);
  border-inline-start: 2px solid var(--bless-color-rule);
}
.bless-query__match,
.bless-query__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-query__remove-group {
  margin-inline-start: auto;
}
.bless-query__rules {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-query__rule {
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) minmax(7rem, 1fr) minmax(7rem, 1.5fr) auto;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-query__rule > .bless-query__remove {
  grid-column: -2;
}
@media (max-width: 560px) {
  .bless-query__rule {
    grid-template-columns: 1fr 1fr auto;
  }
  .bless-query__rule > :nth-child(3):not(.bless-query__remove) {
    grid-column: 1 / -2;
    grid-row: 2;
  }
  .bless-query__rule > .bless-query__remove {
    grid-row: 1;
    grid-column: 3;
  }
}
</style>
