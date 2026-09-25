---
title: ScrollArea
---

<script setup>
import ScrollAreaBasic from "../demos/ScrollAreaBasic.vue";
</script>

# ScrollArea

<p class="bless-lead">Thin scrollbar + fade</p>

A box that scrolls on its own inside a page — a long list in a sidebar, a code block, a wide table. Prefer letting the page scroll; nested scrolling is easy to get stuck in on phones.
<Demo title="Basic">
<ScrollAreaBasic />
<template #code>

<<< ../demos/ScrollAreaBasic.vue

  </template>
</Demo>

- It is focusable so keyboard users can scroll it with the arrows. Give it a `label` and it becomes a named region, so that stop is announced as something.
- `axis` picks the scroll direction; `fade` shades the edges while there's more to see.

## Usage

```ts
import { BlessScrollArea } from "blessing-ui";
```

## API

<PropsTable name="BlessScrollArea" />
