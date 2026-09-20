<script setup lang="ts">
import { useLink } from "../composables/useLink";
import type { BlessTreeNode } from "./tree";

defineOptions({ name: "BlessTreeItem" });
const link = useLink();

const props = defineProps<{
  node: BlessTreeNode;
  path: string;
  selected?: string;
  level: number;
}>();
const emit = defineEmits<{ select: [node: BlessTreeNode, path: string] }>();
const id = () => props.node.id ?? props.path;
</script>

<template>
  <li
    class="bless-tree__item"
    role="treeitem"
    :aria-selected="selected === id()"
    :aria-level="level"
    :aria-disabled="node.disabled || undefined"
  >
    <details v-if="node.children?.length" class="bless-tree__branch" :open="node.open">
      <summary class="bless-tree__row" :class="{ 'bless-tree__row--selected': selected === id() }">
        <span class="bless-tree__chevron" aria-hidden="true">›</span>
        <span v-if="node.icon" class="bless-tree__icon" aria-hidden="true">{{ node.icon }}</span>
        <span
          class="bless-tree__label"
          @click.prevent="!node.disabled && emit('select', node, id())"
          >{{ node.label }}</span
        >
      </summary>
      <ul class="bless-tree__group" role="group">
        <BlessTreeItem
          v-for="(c, i) in node.children"
          :key="c.id ?? i"
          :node="c"
          :path="`${path}/${c.id ?? i}`"
          :selected
          :level="level + 1"
          @select="(n, p) => emit('select', n, p)"
        />
      </ul>
    </details>
    <component
      :is="link(node.href, undefined, 'button').is"
      v-bind="link(node.href, undefined, 'button').attrs"
      v-else
      :type="node.href ? undefined : 'button'"
      class="bless-tree__row bless-tree__row--leaf"
      :class="{ 'bless-tree__row--selected': selected === id() }"
      :disabled="node.href ? undefined : node.disabled"
      @click="!node.disabled && emit('select', node, id())"
    >
      <span v-if="node.icon" class="bless-tree__icon" aria-hidden="true">{{ node.icon }}</span>
      <span class="bless-tree__label">{{ node.label }}</span>
    </component>
  </li>
</template>
