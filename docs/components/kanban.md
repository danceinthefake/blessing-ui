---
title: Kanban
---

<script setup>
import KanbanBasic from "../demos/KanbanBasic.vue";
</script>

# Kanban

<p class="bless-lead">Columns of cards, drag between columns, WIP limits</p>

A board whose cards move between columns — tasks, applicants, orders. For one list that only reorders, use [Sortable](./sortable); for two lists with transfer buttons, [PickList](./pick-list).

<Demo title="Basic">
  <KanbanBasic />
  <template #code>

<<< ../demos/KanbanBasic.vue

  </template>
</Demo>

- `v-model` is the whole board: `[{ id, title, items, limit? }]`. Moves produce a new array, so it works with `ref`, a store or immutable updates.
- Drag a card by its grip, with mouse, touch or pen. A line shows where it will land; the move happens on release, in the same column or another.
- A column with a `limit` refuses drops once it holds that many cards, and its count turns red. Cards can still be reordered inside it.
- Keyboard: focus a grip, **Space** grabs, **↑ ↓** move the card within its column, **← →** to the next column (mirrored under RTL), **Space** drops, **Esc** puts everything back. Each step is announced.
- `#card="{ item, column, index }"` draws a card, `#header="{ column }"` replaces the column title. `move` gives `(item, from, to)` with `{ column, index }` on each side.
- Holding a card near the board's left or right edge scrolls the board; near the top or bottom of the window scrolls the page (`useAutoScroll` is exported if you build your own drag surface).
- Pass `rowKey` when cards have an id so they keep their state as they move.

## Usage

```ts
import { BlessKanban } from "blessing-ui";
```

## API

<PropsTable name="BlessKanban" />
