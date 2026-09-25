---
title: Tree
---

<script setup>
import TreeBasic from "../demos/TreeBasic.vue";
</script>

# Tree

<p class="bless-lead">Nested details tree, role=tree</p>

A hierarchy people expand and browse — files, a category tree, a table of contents. For a small chart of who reports to whom, [OrgChart](./org-chart); to pick one value from a hierarchy, [TreeSelect](./tree-select).

<Demo title="Basic">
  <TreeBasic />
  <template #code>

<<< ../demos/TreeBasic.vue

  </template>
</Demo>

Keyboard: <kbd>↑</kbd> <kbd>↓</kbd> move between visible rows, <kbd>→</kbd> opens a branch (or steps into it), <kbd>←</kbd> closes it (or jumps to the parent), <kbd>Home</kbd> / <kbd>End</kbd>. <kbd>Enter</kbd> / <kbd>Space</kbd> toggle a branch natively.

- One Tab stop: ↑ / ↓ move through the visible rows, → opens a branch or enters it, ← closes it or goes to the parent, Home / End jump. Branches say whether they're open.
- Branches are native `<details>`, so they work before scripts run. `href` makes a leaf a link; `v-model:selected` holds the picked id.

## Usage

```ts
import { BlessTree, BlessTreeItem } from "blessing-ui";
```

## API

### BlessTree

<PropsTable name="BlessTree" />

### BlessTreeItem

<PropsTable name="BlessTreeItem" />
