---
title: InfiniteScroll
---

<script setup>
import InfiniteScrollBasic from "../demos/InfiniteScrollBasic.vue";
</script>

# InfiniteScroll

<p class="bless-lead">Load more at the end</p>

Loads the next page as the reader nears the end of a feed. It suits browsing (a timeline, search results you skim); for results people come back to, share or need the footer of, [Pagination](./pagination) is kinder.
<Demo title="Basic">
<InfiniteScrollBasic />
<template #code>

<<< ../demos/InfiniteScrollBasic.vue

  </template>
</Demo>

- `@load` gets a `done` callback: call `done()` when the page is in, `done(true)` when there are no more. While loading, "Loading more" (`loadingText`) is announced.
- `disabled` pauses it and turning it back on resumes. Where scrolling can't trigger loading (no IntersectionObserver), a Load more button (`moreLabel`) takes its place.

## Usage

```ts
import { BlessInfiniteScroll } from "blessing-ui";
```

## API

<PropsTable name="BlessInfiniteScroll" />
