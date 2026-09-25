---
title: Resizable
---

<script setup>
import ResizableBasic from "../demos/ResizableBasic.vue";
</script>

# Resizable

<p class="bless-lead">Two-pane split</p>

Two panes with a divider people drag — an editor and its preview, a list and its detail. Keep a sensible default size; many people never move it.
<Demo title="Basic">
<ResizableBasic />
<template #code>

<<< ../demos/ResizableBasic.vue

  </template>
</Demo>

- The divider is a focusable separator: arrows move it by `step`, Home/End go to `min`/`max`, Enter or a double-click resets to half.
- `v-model` is the first pane's size in %. `direction="vertical"` stacks the panes. In right-to-left pages the first pane is on the right and dragging follows the pointer.

## Usage

```ts
import { BlessResizable } from "blessing-ui";
```

## API

<PropsTable name="BlessResizable" />
