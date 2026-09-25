---
title: DeferredContent
---

<script setup>
import DeferredContentBasic from "../demos/DeferredContentBasic.vue";
</script>

# DeferredContent

<p class="bless-lead">Render when scrolled into view</p>

Content rendered only when it scrolls near the viewport — a heavy chart, an embed, comments at the end of a long page. Don't defer what people search the page for: until it renders, find-in-page and screen readers can't see it.
<Demo title="Basic">
<DeferredContentBasic />
<template #code>

<<< ../demos/DeferredContentBasic.vue

  </template>
</Demo>

- `rootMargin` starts it before it's visible (200px ahead by default); `minHeight` holds space so the page doesn't jump.
- `#placeholder` shows until then; `@load` fires once, including where IntersectionObserver is missing and it renders at once.

## Usage

```ts
import { BlessDeferredContent } from "blessing-ui";
```

## API

<PropsTable name="BlessDeferredContent" />
