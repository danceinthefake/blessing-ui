---
title: DataTable
---

<script setup>
import DataTableBasic from "../demos/DataTableBasic.vue";
import DataTableServer from "../demos/DataTableServer.vue";
</script>

# DataTable

<p class="bless-lead">Table + sort/search/select/paginate</p>

Rows people sort, search, page through and pick from — an admin list, an order history. For a small table that just shows data, use [Table](./table); for cards instead of rows, [DataView](./data-view).

Everything runs in the browser by default — hand it the full array and it sorts, filters and slices. For large sets switch to server mode below and the table becomes a thin view over one page at a time. When rows nest, [TreeTable](./tree-table).

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

- Client mode sorts, filters and pages `rows` itself. With `server`, `rows` is one page: listen to `@state` (sort, query, page, page size) and fetch; set `total` and `loading` while you do — the table is marked busy and dims.
- Mark one column `header: true`: its cells become row headers, and row checkboxes are named after them ("Select Megumi").
- `@rowClick` is for pointer convenience only. Put a link or button in a cell for anything keyboard users must reach.
- The row count is a status, so a search or page change is announced.

## Usage

```ts
import { BlessDataTable } from "blessing-ui";
```

## API

<PropsTable name="BlessDataTable" />
