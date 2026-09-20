---
title: DataTable
---

<script setup>
import DataTableBasic from "../demos/DataTableBasic.vue";
import DataTableServer from "../demos/DataTableServer.vue";
</script>

# DataTable

<p class="bless-lead">Table + sort/search/select/paginate</p>

## When to use

Use it when a plain `BlessTable` isn't enough: the user needs to sort, search, pick rows or page through more than fits on screen. Everything runs in the browser by default — hand it the full array and it sorts, filters and slices. For large sets switch to server mode below and the table becomes a thin view over one page at a time.

Prefer `BlessTable` when the data is small and read-only; prefer `BlessTreeTable` when rows nest; prefer `BlessDataView` when each item wants a card rather than a row.

<Demo title="Basic">
  <DataTableBasic />
  <template #code>

<<< ../demos/DataTableBasic.vue

  </template>
</Demo>

<Demo title="Server mode">
  <DataTableServer />
  <template #code>

<<< ../demos/DataTableServer.vue

  </template>
</Demo>

**Server mode** — pass `server` and `total`; the rows you give are the current page, and every sort / search / page / page-size change emits `state` for you to fetch with. Nothing is sorted or sliced on the client.

## Usage

```ts
import { BlessDataTable } from "blessing-ui";
```

## API

<PropsTable name="BlessDataTable" />
