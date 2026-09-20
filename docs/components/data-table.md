---
title: DataTable
---

<script setup>
import DataTableBasic from "../demos/DataTableBasic.vue";
import DataTableServer from "../demos/DataTableServer.vue";
</script>

# DataTable

<p class="bless-lead">Table + sort/search/select/paginate</p>

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
