---
title: Background
---

<script setup>
import BackgroundBasic from "../demos/BackgroundBasic.vue";
</script>

# Background

<p class="bless-lead">Tiled texture layer</p>

A decorative layer behind a page or a section: a tiled image, or the built-in hairline pattern. It is hidden from screen readers and never takes clicks.
<Demo title="Basic">
<BackgroundBasic />
<template #code>

<<< ../demos/BackgroundBasic.vue

  </template>
</Demo>

- `mode="fixed"` pins it to the viewport (put it once, at page level); `absolute` (default) fills the nearest positioned parent.
- `offset` shifts the tile vertically, so neighbouring pages can use different parts of one image.
- Keep text over it readable: lower `opacity` rather than relying on the text colour.

## Usage

```ts
import { BlessBackground } from "blessing-ui";
```

## API

<PropsTable name="BlessBackground" />
