---
title: Tree
---

<script setup>
import TreeBasic from "../demos/TreeBasic.vue";
</script>

# Tree

<p class="bless-lead">Nested details tree, role=tree</p>

<Demo title="Basic">
  <TreeBasic />
  <template #code>

<<< ../demos/TreeBasic.vue

  </template>
</Demo>

Keyboard: <kbd>↑</kbd> <kbd>↓</kbd> move between visible rows, <kbd>→</kbd> opens a branch (or steps into it), <kbd>←</kbd> closes it (or jumps to the parent), <kbd>Home</kbd> / <kbd>End</kbd>. <kbd>Enter</kbd> / <kbd>Space</kbd> toggle a branch natively.

## Usage

```ts
import { BlessTree, BlessTreeItem } from "blessing-ui";
```

## API

### BlessTree

<PropsTable name="BlessTree" />

### BlessTreeItem

<PropsTable name="BlessTreeItem" />
