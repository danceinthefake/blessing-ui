---
title: Invoice
---

# Invoice

<p class="bless-lead">An invoice with the parties, the lines, the tax, the totals, and the payment state</p>

Shows a bill in an ERP, an accounting app, or a customer portal. It also prints on one page. To edit the lines, use the [line-item editor](./line-item-editor).

<Demo title="Basic">
  <InvoiceBasic />
  <template #code>

<<< ../demos/InvoiceBasic.vue

  </template>
</Demo>

- `number`, `issued`, `from`, `to`, and `lines` are required. `issued` and `due` are days as `YYYY-MM-DD`, in `time` elements.
- `from` and `to` each have a `name` and optional `lines`, such as the address and a tax number.
- `lines` is a list. Each line has a `description`, a `quantity`, the `price` of one without tax, and an optional `tax` rate in percent.
- The table ends with the subtotal, the tax for each rate, and the total. `paid` takes off what is already paid, and the last line is the amount due.
- `status` is `draft` (default), `sent`, `paid`, or `overdue`. It shows as a mark and a word.
- `notes` shows under the table, for example the bank details. In print, the frame and the colors go away.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format of the money and the dates.
- Change the words with `labels` or a [label pack](../guide/translating). The keys are the four states, the column and total names, and `tax` (a function). The API table lists them all.

The `invoiceTotals` function adds up the lines. It is exported for your own views.

## Usage

```ts
import { BlessInvoice } from "blessing-ui";
```

## API

<PropsTable name="BlessInvoice" />

<script setup>
import InvoiceBasic from "../demos/InvoiceBasic.vue";
</script>
