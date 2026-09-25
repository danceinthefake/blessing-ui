---
title: Panel
---

<script setup>
import PanelBasic from "../demos/PanelBasic.vue";
</script>

# Panel

<p class="bless-lead">Titled box with actions, toggleable</p>

A titled box of related content inside a page — a settings group, a side summary. It is a `section` named by its title. For the page's own sections, use [Section](./section); for items in a set, [Card](./card).
<Demo title="Basic">
<PanelBasic />
<template #code>

<<< ../demos/PanelBasic.vue

  </template>
</Demo>

- `level` sets the title's heading level (3 by default) so it fits the page's outline.
- `toggleable` adds a button named by the title that collapses the body (`v-model:collapsed`); `#actions` sits beside it.

## Usage

```ts
import { BlessPanel } from "blessing-ui";
```

## API

<PropsTable name="BlessPanel" />
