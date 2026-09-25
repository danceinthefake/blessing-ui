---
title: ScrollTop
---

<script setup>
import ScrollTopBasic from "../demos/ScrollTopBasic.vue";
</script>

# ScrollTop

<p class="bless-lead">Back-to-top button past a threshold</p>

A back-to-top button for long pages, shown once the reader has scrolled a way down (`threshold`). Short pages don't need one.
<Demo title="Basic">
<ScrollTopBasic />
<template #code>

<<< ../demos/ScrollTopBasic.vue

  </template>
</Demo>

- It scrolls smoothly, or jumps straight up under reduced motion.
- `target` watches a scroll container instead of the window; `label` names the button.

## Usage

```ts
import { BlessScrollTop } from "blessing-ui";
```

## API

<PropsTable name="BlessScrollTop" />
