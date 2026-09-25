---
title: DataView
---

<script setup>
import DataViewBasic from "../demos/DataViewBasic.vue";
</script>

# DataView

<p class="bless-lead">List / grid with pagination</p>

A collection shown as cards or rows you design yourself — a catalogue, a gallery of episodes — with a list/grid switch and paging. For tabular data people sort and select, use [DataTable](./data-table).

<Demo title="Basic">
  <DataViewBasic />
  <template #code>

<<< ../demos/DataViewBasic.vue

  </template>
</Demo>

- The default slot renders each item with `{ item, index, layout }`, so one template can adapt to list and grid.
- `columns` is the minimum card width in grid layout; `pageSize` pages client-side (0 shows everything). When `items` shrinks, the page follows back to the last one.
- `#empty` replaces "No items".

## Usage

```ts
import { BlessDataView } from "blessing-ui";
```

## API

<PropsTable name="BlessDataView" />
