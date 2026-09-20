<script setup lang="ts">
import BlessOrgChartNode from "./BlessOrgChartNode.vue";
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessOrgChart" });
withDefaults(defineProps<{ nodes: BlessTreeNode[]; label?: string }>(), { label: "Organisation" });
const selected = defineModel<string | undefined>("selected");
const emit = defineEmits<{ select: [node: BlessTreeNode, id: string] }>();
</script>

<template>
  <div class="bless-org" role="tree" :aria-label="label">
    <ul class="bless-org__level" role="group">
      <BlessOrgChartNode
        v-for="(n, i) in nodes"
        :key="n.id ?? i"
        :node="n"
        :path="String(n.id ?? i)"
        :selected
        @select="(node, id) => ((selected = id), emit('select', node, id))"
      >
        <template #node="s"><slot name="node" v-bind="s" /></template>
      </BlessOrgChartNode>
    </ul>
  </div>
</template>

<style>
/* classic CSS org chart: ul/li with border connectors */
.bless-org {
  overflow-x: auto;
  padding: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-org > ul.bless-org__level {
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-org ul > li.bless-org__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--bless-space-4) var(--bless-space-2) 0;
  margin: 0;
}
/* vertical stem above each node */
.bless-org li.bless-org__item::before {
  content: "";
  position: absolute;
  top: 0;
  inset-inline-start: 50%;
  width: var(--bless-border-width);
  height: var(--bless-space-4);
  background: var(--bless-color-border);
}
/* horizontal rail across siblings */
.bless-org li.bless-org__item::after {
  content: "";
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  height: var(--bless-border-width);
  background: var(--bless-color-border);
}
.bless-org li.bless-org__item:first-child::after {
  inset-inline-start: 50%;
}
.bless-org li.bless-org__item:last-child::after {
  inset-inline-end: 50%;
}
.bless-org li.bless-org__item:only-child::after {
  display: none;
}
.bless-org > .bless-org__level > .bless-org__item::before,
.bless-org > .bless-org__level > .bless-org li.bless-org__item::after {
  display: none;
}
.bless-org > ul.bless-org__level > li.bless-org__item {
  padding-top: 0;
}
/* stem below a node that has children */
.bless-org li > ul.bless-org__children {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: var(--bless-space-4) 0 0;
  list-style: none;
}
.bless-org ul.bless-org__children::before {
  content: "";
  position: absolute;
  top: 0;
  inset-inline-start: 50%;
  width: var(--bless-border-width);
  height: var(--bless-space-4);
  background: var(--bless-color-border);
}
.bless-org__node {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 120px;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-org__node > * {
  transform: skewX(var(--bless-skew-counter));
}
.bless-org__node:hover {
  border-color: var(--bless-color-text-muted);
}
.bless-org__node:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-org__node--selected {
  border-color: var(--bless-color-accent-text);
  color: var(--bless-color-accent-text);
}
.bless-org__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
.bless-org__desc {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
