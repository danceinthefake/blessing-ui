---
title: Sheet
---

<script setup>
import SheetBasic from "../demos/SheetBasic.vue";
</script>

# Sheet

<p class="bless-lead">Side panel</p>

A panel from the edge of the screen that keeps the page's context — a cart, filters, a detail pane, navigation on phones. From the bottom on phones, see [Drawer](./drawer).

<Demo title="Basic">
  <SheetBasic />
  <template #code>

<<< ../demos/SheetBasic.vue

  </template>
</Demo>

- A native `<dialog>` like [Modal](./modal): inert page, Tab trapped, Esc closes, focus returns. `title` or `#title` names it.
- `dismissible` (default) lets Esc, the backdrop and (with `handle`) a swipe down close it; off, only your own control does.
- `side` picks the edge; `size` its width or height.

## Usage

```ts
import { BlessSheet } from "blessing-ui";
```

## API

<PropsTable name="BlessSheet" />
