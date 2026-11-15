---
title: Bulk action bar
---

<script setup>
import BulkActionBarBasic from "../demos/BulkActionBarBasic.vue";
</script>

# Bulk action bar

<p class="bless-lead">A bar of actions for the selected rows</p>

Comes up when a person selects rows in a list or a table, with the count and the actions for all of them, for example Archive or Delete. Use it with the selection of a [data table](./data-table) or a list of [checkboxes](./checkbox).

<Demo title="Basic">
  <BulkActionBarBasic />
  <template #code>

<<< ../demos/BulkActionBarBasic.vue

  </template>
</Demo>

- `count` is how many rows are selected. If it is more than 0, the bar comes up. At 0, the bar goes away.
- Put the action buttons in the default slot. They show light text on the dark bar. The × button emits `clear`, and your app clears the selection.
- The bar sticks to the bottom of the box that scrolls, so it stays in view over a long list. `fixed` puts it on the bottom of the window.
- The bar is a toolbar: it has one Tab stop, and the arrow keys move between the buttons. A new count is spoken, for example "3 selected".
- The bar slides up into view. With reduced motion, it shows at once.
- Change the words with `labels` or a [label pack](../guide/translating): `label` (the name of the toolbar), `selected` (a function of the count), and `clear`.

## Usage

```ts
import { BlessBulkActionBar } from "blessing-ui";
```

## API

<PropsTable name="BlessBulkActionBar" />
