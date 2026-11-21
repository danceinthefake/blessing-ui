---
title: Line-item editor
---

# Line-item editor

<p class="bless-lead">Rows of products with quantity, unit, price, discount, and tax, and the totals</p>

Edits the lines of a quote, a sales order, a purchase order, or an invoice in an ERP. To show the result, use the [invoice](./invoice).

<Demo title="Basic">
  <LineItemEditorBasic />
  <template #code>

<<< ../demos/LineItemEditorBasic.vue

  </template>
</Demo>

- `v-model` is the list of lines. Each line has an `id`, a `product`, a `quantity`, and a `price` of one. It can also have a `unit`, a `discount` in percent, and a `tax` in percent.
- Each cell is a native field. Each field has a name with its line, such as "Qty, line 2", so screen readers know which row they are in.
- The amount of a line is quantity × price, less the discount. The tax is on that net amount.
- "Add a line" adds an empty line with the unit and tax of the last line, and moves the focus to it. The ✕ button removes a line.
- Under the table, the totals show the subtotal, the discounts, the tax, and the total. Screen readers hear the new totals after each change.
- `units` is the list of units in the menu (default pcs, hour, box, and kg).
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `lineTotals` and `lineNet` functions do the math. They are exported for your own views.

## Usage

```ts
import { BlessLineItemEditor } from "blessing-ui";
```

## API

<PropsTable name="BlessLineItemEditor" />

<script setup>
import LineItemEditorBasic from "../demos/LineItemEditorBasic.vue";
</script>
