---
title: TreeTable
---

<script setup>
import TreeTableBasic from "../demos/TreeTableBasic.vue";
</script>

# TreeTable

<p class="bless-lead">Expandable rows on BlessTable</p>

## When to use

A table whose rows can contain rows: file systems, org units, nested accounts. It renders through `BlessTable`, so columns, striping, row headers and cell slots all work the same; the first column (or `treeColumn`) gets the indent and the expand toggle. Control which rows are open with `v-model:expanded`.

For a plain hierarchy without columns, `BlessTree` is lighter. For a flat table, `BlessTable` or `BlessDataTable`.

<Demo title="Basic">
  <TreeTableBasic />
  <template #code>

<<< ../demos/TreeTableBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessTreeTable } from "blessing-ui";
```

## API

<PropsTable name="BlessTreeTable" />
