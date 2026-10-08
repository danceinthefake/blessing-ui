---
title: Sortable
---

<script setup>
import SortableBasic from "../demos/SortableBasic.vue";
import SortableGrid from "../demos/SortableGrid.vue";
import SortableGroup from "../demos/SortableGroup.vue";
</script>

# Sortable

<p class="bless-lead">Drag-to-reorder list or grid, keyboard grab and move</p>

A list or grid whose order the user sets by hand — a playlist, a dashboard layout, a set of cards. Each row has a grip; drag the grip, or focus it and use the keyboard. For a list that also needs ↑ ↓ buttons, use [OrderList](./order-list); to move items between two lists, use [PickList](./pick-list).

<Demo title="Basic">
  <SortableBasic />
  <template #code>

<<< ../demos/SortableBasic.vue

  </template>
</Demo>

<Demo title="Grid">
  <SortableGrid />
  <template #code>

<<< ../demos/SortableGrid.vue

  </template>
</Demo>

<Demo title="Between lists">
  <SortableGroup />
  <template #code>

<<< ../demos/SortableGroup.vue

  </template>
</Demo>

- Pointer drag works with mouse, touch and pen (the grip sets `touch-action: none`, so the page still scrolls when you swipe elsewhere). A line marks where the item will land; the order changes on release.
- Keyboard: focus a grip, **Space** or **Enter** grabs the item, **← ↑** and **→ ↓** move it (mirrored under RTL), **Space** drops it, **Esc** puts everything back. Each step is announced.
- Holding a grip near the top or bottom of the window scrolls the page, so a long list can be dragged across.
- `:columns="3"` lays the items out as a grid; the drop marker turns vertical.
- `group="name"` on two or more lists lets them trade items: drag a grip over another list (an empty one shows a dashed outline), or hold an item and press **Alt+←** / **Alt+→** to send it to the neighbouring list, where it stays held. **Esc** puts every list in the group back. Each list keeps its own `v-model`; the sending list emits `transfer` with `(item, from, to)`.
- Pass `rowKey` when items have an id, so rows keep their state as they move.
- The `move` event gives `(from, to)`. `useSortable` is exported for building your own sortable surface.

## Usage

```ts
import { BlessSortable } from "blessing-ui";
```

## API

<PropsTable name="BlessSortable" />
