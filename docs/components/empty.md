---
title: Empty
---

<script setup>
import EmptyBasic from "../demos/EmptyBasic.vue";
</script>

# Empty

<p class="bless-lead">Empty state</p>

What a list, table or page shows when there is nothing in it — and, more usefully, what to do about that. Three cases: **nothing yet** (first run: say what will appear here and give the one action that makes it appear), **no results** (a search or filter matched nothing: offer to clear it), and **couldn't load** — which is not empty, it's an error; use [Alert](./alert) with a retry.

The title says what is empty; the description says what happens next; the default slot holds the action or two. `#icon` takes a glyph or an SVG on a small plate. `variant="plain"` drops the frame and halves the padding for use inside a table body or a list. The [Page states](../blocks/states) block shows the three cases side by side.

A **no results** state appears while someone is typing, so a screen reader user won't notice it by itself: put the result count in a `role="status"` region next to the search field ("0 results") rather than making the empty state a live region.

<Demo title="Basic">
  <EmptyBasic />
  <template #code>

<<< ../demos/EmptyBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessEmpty } from "blessing-ui";
```

## API

<PropsTable name="BlessEmpty" />
