---
title: Pagination
---

<script setup>
import PaginationBasic from "../demos/PaginationBasic.vue";
</script>

# Pagination

<p class="bless-lead">Page list</p>

Moving between pages of results. For a feed people read to the end, [InfiniteScroll](./infinite-scroll) or a Load more button fits better; pages suit results people come back to or share.

<Demo title="Basic">
  <PaginationBasic />
  <template #code>

<<< ../demos/PaginationBasic.vue

  </template>
</Demo>

- With `href`, pages are links (through your router when provided), so each page has a URL; without it they are buttons and `v-model` holds the page.
- `siblings` sets how many pages show either side of the current one; the rest collapse to `…`.
- The current page has `aria-current="page"`; `prevLabel` / `nextLabel` name the arrows.

## Usage

```ts
import { BlessPagination } from "blessing-ui";
```

## API

<PropsTable name="BlessPagination" />
