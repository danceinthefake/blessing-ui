---
title: Transaction list
---

# Transaction list

<p class="bless-lead">Payments in and out, grouped by day, with a total for each day</p>

Shows the history of an account in a bank, wallet, or shop app. For the balance above it, use the [balance card](./balance-card).

<Demo title="Basic">
  <TransactionListBasic />
  <template #code>

<<< ../demos/TransactionListBasic.vue

  </template>
</Demo>

- `transactions` is a list of payments. Each payment has an `id`, a `title`, an `amount`, and a `date` as `YYYY-MM-DD`. It can also have a `category`, an `icon`, and `pending`.
- Money in is a positive amount, and money out is negative. Every amount has a sign, such as "+$300.00" or "−$20.00". Money in is also bold, but the sign carries the meaning.
- The newest day comes first. The heading of each day shows the date and the total of the day.
- Without an `icon`, the row shows the first letter of the title.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format of the money and the dates.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `pending`, and `total` (a function of the formatted sum).

## Usage

```ts
import { BlessTransactionList } from "blessing-ui";
```

## API

<PropsTable name="BlessTransactionList" />

<script setup>
import TransactionListBasic from "../demos/TransactionListBasic.vue";
</script>
