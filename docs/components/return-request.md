---
title: Return request
---

# Return request

<p class="bless-lead">Pick the items and the reason for a return, then see the refund</p>

Lets a buyer send back items from an order. The refund updates while the buyer picks the items.

<Demo title="Basic">
  <ReturnRequestBasic />
  <template #code>

<<< ../demos/ReturnRequestBasic.vue

  </template>
</Demo>

- `items` is the list of items in the order. Each item has an `id`, a `name`, the `quantity` that the buyer bought, the `price` of one, and an optional `image`.
- Each item has a native check box. A checked item goes back in full. If the buyer bought more than one, a menu lets them send back fewer.
- `reasons` is the list of reasons in the menu. The default has four reasons.
- If no item or no reason is chosen, the button shows an error that screen readers hear at once. The reason menu is then marked as not valid.
- A good request emits `submit` with the items and their quantities, the reason, and the note.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `items`, `reason`, `pick`, `note`, `refund`, `submit`, `missing`, and `quantity` (a function). The reasons are your own text.

## Usage

```ts
import { BlessReturnRequest } from "blessing-ui";
```

## API

<PropsTable name="BlessReturnRequest" />

<script setup>
import ReturnRequestBasic from "../demos/ReturnRequestBasic.vue";
</script>
