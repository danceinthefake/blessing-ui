---
title: Treemap
---

<script setup>
import TreemapBasic from "../demos/TreemapBasic.vue";
</script>

# Treemap

<p class="bless-lead">Part-to-whole as nested rectangles, with drill-down</p>

One rectangle per item, sized by its value, grouped into the things that contain them — disk use, a budget, traffic by section, a bundle. It answers "what takes up the space?" at a glance. For a few parts of one total, a [MeterGroup](./meter-group) is clearer; for a trend, [Sparkline](./sparkline); for exact numbers, a [DataTable](./data-table).

<Demo title="Repository size">
  <TreemapBasic />
  <template #code>

<<< ../demos/TreemapBasic.vue

  </template>
</Demo>

- `data` is a tree of `{ id, label, value?, children?, color? }`. A leaf's size is its `value`; a group's is the sum of what it holds. Items with no size are left out. Tiles are squarified so they stay near square and readable.
- Click or press **Enter** on a group to open it; the path above (`v-model:path`, ids from the top) shows where you are, any step of it goes back, and **Backspace** goes up one level. A leaf only emits `select`.
- Keyboard: one tile is in the tab order; **arrow keys** move to the nearest tile that way, **Home** / **End** jump. Every tile is named with its label, size, share of the level and whether it holds more — readable even when the tile is too small to print its text.
- Each top-level node gets one chart colour and everything inside it keeps it; set `color` on a node (a token name or any CSS colour) to choose. Tiles are tinted, never solid, so their text keeps its contrast.
- It fills the width and is `height` px tall; it re-lays out as the width changes. `format` puts units on sizes.

## Usage

```ts
import { BlessTreemap } from "blessing-ui";
```

## API

<PropsTable name="BlessTreemap" />
