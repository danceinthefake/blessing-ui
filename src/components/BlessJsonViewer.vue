<script setup lang="ts">
import { computed } from "vue";
import BlessTree from "./BlessTree.vue";
import { jsonToNodes } from "./json";

defineOptions({ name: "BlessJsonViewer" });

const props = withDefaults(
  defineProps<{
    /** any value: a parsed JSON response, a store, a config object */
    value: unknown;
    /** the name of the root line */
    rootLabel?: string;
    /** levels below the root that start open */
    openDepth?: number;
    /** children shown per object or array before a "… n more" line */
    limit?: number;
    /** names the tree for screen readers */
    label?: string;
  }>(),
  { rootLabel: "root", openDepth: 1, limit: 100, label: "JSON" },
);
const nodes = computed(() =>
  jsonToNodes(props.value, props.rootLabel, { openDepth: props.openDepth, limit: props.limit }),
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
