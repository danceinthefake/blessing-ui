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

## Usage

```ts
import { BlessTree, BlessTreeItem } from "blessing-ui";
```

## API

### BlessTree

<PropsTable name="BlessTree" />

### BlessTreeItem

<PropsTable name="BlessTreeItem" />
