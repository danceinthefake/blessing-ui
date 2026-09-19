<script setup lang="ts">
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessOrgChartNode" });
const props = defineProps<{ node: BlessTreeNode; path: string; selected?: string }>();
const emit = defineEmits<{ select: [node: BlessTreeNode, id: string] }>();
defineSlots<{ node?: (p: { node: BlessTreeNode; selected: boolean }) => unknown }>();
const id = () => props.node.id ?? props.path;
</script>

<template>
  <li
    class="bless-org__item"
    role="treeitem"
    :aria-selected="selected === id()"
    :aria-expanded="node.children?.length ? true : undefined"
  >
    <button
      type="button"
      class="bless-org__node"
      :class="{ 'bless-org__node--selected': selected === id() }"
      @click="emit('select', node, id())"
    >
      <slot name="node" :node :selected="selected === id()">
        <span v-if="node.icon" class="bless-org__icon" aria-hidden="true">{{ node.icon }}</span>
        <span class="bless-org__label">{{ node.label }}</span>
        <span v-if="node.href" class="bless-org__desc">{{ node.href }}</span>
      </slot>
    </button>
    <ul v-if="node.children?.length" class="bless-org__children" role="group">
      <BlessOrgChartNode
        v-for="(c, i) in node.children"
        :key="c.id ?? i"
        :node="c"
        :path="`${path}/${c.id ?? i}`"
        :selected
        @select="(n, p) => emit('select', n, p)"
      >
        <template #node="s"><slot name="node" v-bind="s" /></template>
      </BlessOrgChartNode>
    </ul>
  </li>
</template>
