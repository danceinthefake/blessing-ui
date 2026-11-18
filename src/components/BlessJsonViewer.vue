<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed } from "vue";
import BlessTree from "./BlessTree.vue";
import { jsonToNodes } from "./json";

defineOptions({ name: "BlessJsonViewer" });

const props = withDefaults(
  defineProps<{
    /** any value: a parsed JSON response, a store, a config object */
    value: unknown;
    /** levels below the root that start open */
    openDepth?: number;
    /** children shown per object or array before a "… n more" line */
    limit?: number;
    /** names the tree for screen readers */
    label?: string;
    labels?: Partial<{ root: string }>;
  }>(),
  { openDepth: 1, limit: 100, label: "JSON" },
);
const pack = useLabelPack("BlessJsonViewer");
const text = computed(() => ({
  root: "root",
  ...pack(),
  ...props.labels,
}));

const nodes = computed(() =>
  jsonToNodes(props.value, text.value.root, { openDepth: props.openDepth, limit: props.limit }),
);
</script>

<template>
  <BlessTree class="bless-json" :nodes="nodes" :label="label" />
</template>

<style>
.bless-json {
  font-family: var(--bless-font-mono);
}
</style>
