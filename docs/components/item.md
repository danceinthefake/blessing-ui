---
title: Item
---

<script setup>
import ItemBasic from "../demos/ItemBasic.vue";
</script>

# Item

<p class="bless-lead">Media + title + description + actions</p>

One row of a list: something on the left (`#media` — an icon, an avatar, a cover), a title with an optional description and free content, and `#actions` on the right. Three surfaces: `plain`, `outline`, `surface`; `size="sm"` for dense lists.

Three kinds of row. **Static** (default) — content only. **Link** (`href`) — the whole row is an `<a>` (or your router's link), so `#actions` must stay non-interactive: an arrow, a badge, a date; a button inside a link is invalid and unreachable. **Button** (`button`) — the whole row is a `<button>`: the selectable-row pattern of an inbox or a picker, with Enter and Space for free; the [Inbox](../blocks/inbox) block is this. Need real buttons on a static row? Put the link on the title with `#title` instead of `href`.

The date — title news row is [ListItem](./list) inside a `BlessList`; a box with media _above_ is [Card](./card).

<Demo title="Basic">
  <ItemBasic />
  <template #code>

<<< ../demos/ItemBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessItem } from "blessing-ui";
```

## API

<PropsTable name="BlessItem" />
