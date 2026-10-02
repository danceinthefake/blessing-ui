---
title: Masonry
---

<script setup>
import MasonryBasic from "../demos/MasonryBasic.vue";
</script>

# Masonry

<p class="bless-lead">Variable-height cards in columns</p>

A wall of cards of different heights — photos, notes, posts — packed so no column has holes. For items of equal size use a plain CSS grid; for a feed read top to bottom, a [DataView](./data-view).

<Demo title="Basic">
  <MasonryBasic />
  <template #code>

<<< ../demos/MasonryBasic.vue

  </template>
</Demo>

- Each card goes into the shortest column, in the order of `items`. The DOM stays in that same order, so reading, tabbing and screen readers follow the list; only the placement is spread over columns.
- `columns` fixes the number of columns; without it as many fit as `minWidth` (px) allows, and the count follows the container as it resizes. `gap` is the space between cards in px.
- Cards are measured, and a card that changes height (an image that loads, text that wraps differently) moves the ones after it. Give images their size (`width` and `height`, or an aspect ratio) to avoid jumps.
- Before the script runs, and without JavaScript, the cards are a normal single column, so nothing is hidden. Under RTL the columns start on the right. Movement between positions is a short slide, off under `prefers-reduced-motion`.
- It lays out with measurements, not the CSS `grid-template-rows: masonry` which is not widely supported yet; if that changes this can shrink to a few lines of CSS.

## Usage

```ts
import { BlessMasonry } from "blessing-ui";
```

## API

<PropsTable name="BlessMasonry" />
