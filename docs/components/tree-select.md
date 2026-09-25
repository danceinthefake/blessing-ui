---
title: TreeSelect
---

<script setup>
import TreeSelectBasic from "../demos/TreeSelectBasic.vue";
</script>

# TreeSelect

<p class="bless-lead">Tree in a popover, single or multiple</p>

A choice from a hierarchy — a folder, a category under a category, a team inside a department. For a flat list use [Select](./select); for a few levels of dependent choice where each level is its own list, [CascadeSelect](./cascade-select).

<Demo title="Basic">
  <TreeSelectBasic />
  <template #code>

<<< ../demos/TreeSelectBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

- Enter, Space or ↓ opens it and focus moves into the tree (onto the picked row); the tree's own arrow keys take over from there.
- `multiple` shows picks as chips. Toggle a row again to remove it, or press Backspace on the field to remove the last one.
- `leafOnly` allows only rows without children. Inside a [Field](./form) the field's label names it.

## Usage

```ts
import { BlessTreeSelect } from "blessing-ui";
```

## API

<PropsTable name="BlessTreeSelect" />
