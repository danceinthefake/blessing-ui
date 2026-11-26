---
title: DataTable
---

# DataTable

<p class="bless-lead">Table + sort/search/select/paginate</p>

Rows people sort, search, page through and pick from: an admin list, an order history. For a small table that just shows data, use [Table](./table). For cards instead of rows, [DataView](./data-view).

Everything runs in the browser by default. Hand it the full array and it sorts, filters and slices. For large sets switch to server mode below and the table becomes a thin view over one page at a time. When rows nest, [TreeTable](./tree-table).

<Demo title="Basic">
  <DataTableBasic />
  <template #code>

<<< ../demos/DataTableBasic.vue

  </template>
</Demo>

<Demo title="Pinned and resizable columns">
  <DataTableColumns />
  <template #code>

<<< ../demos/DataTableColumns.vue

  </template>
</Demo>

**Pinned and resizable columns**. A wide table scrolls sideways. `pin: "start"` or `pin: "end"` on a column keeps it in view while the rest scroll. Pinned columns move to their side. When a column is pinned to the start, the checkbox column is pinned too.

- `resizable` puts a handle on the end edge of each header. Drag it, or focus it and press ← or → to change the width by 16px. The smallest width is 48px. `resizable: false` on a column keeps that column at its width.
- The first resize records the width of every column. After that, the table uses those widths exactly, and text that does not fit ends with "…".
- `v-model:widths` holds the widths in px by column key. Save it, and give it back on the next visit, to keep the layout.

<Demo title="Server mode">
  <DataTableServer />
  <template #code>

<<< ../demos/DataTableServer.vue

  </template>
</Demo>

**Server mode**. Pass `server` and `total`. The rows you give are the current page, and every sort / search / page / page-size change emits `state` for you to fetch with. Nothing is sorted or sliced on the client.

- Client mode sorts, filters and pages `rows` itself. With `server`, `rows` is one page: listen to `@state` (sort, query, page, page size) and fetch. Set `total` and `loading` while you do: the table is marked busy and dims.
- Mark one column `header: true`: its cells become row headers, and row checkboxes are named after them ("Select Megumi").
- `@rowClick` is for pointer convenience only. Put a link or button in a cell for anything keyboard users must reach.
- The row count is a status, so a search or page change is announced.
- `:column-menu="false"` drops the "Columns" menu, and `:footer="false"` drops the row count and the pager. A short table of fixed rows needs neither.
- When the table scrolls sideways, its scroll box takes keyboard focus. Its name is the `caption`, or `labels.table`.

## Usage

```ts
import { BlessDataTable } from "blessing-ui";
```

## API

<PropsTable name="BlessDataTable" />

<script setup>
import DataTableBasic from "../demos/DataTableBasic.vue";
import DataTableServer from "../demos/DataTableServer.vue";
import DataTableColumns from "../demos/DataTableColumns.vue";
</script>
