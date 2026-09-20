---
title: TreeSelect
---

<script setup>
import TreeSelectBasic from "../demos/TreeSelectBasic.vue";
</script>

# TreeSelect

<p class="bless-lead">Tree in a popover, single or multiple</p>

<Demo title="Basic">
  <TreeSelectBasic />
  <template #code>

<<< ../demos/TreeSelectBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessTreeSelect } from "blessing-ui";
```

## API

<PropsTable name="BlessTreeSelect" />
