---
title: Payment schedule
---

# Payment schedule

<p class="bless-lead">The payments of a loan, with dates, the principal, and the interest</p>

Shows how a loan or a payment plan goes down month by month. The principal is the borrowed money, and the interest is the cost of the loan.

<Demo title="Basic">
  <PaymentScheduleBasic />
  <template #code>

<<< ../demos/PaymentScheduleBasic.vue

  </template>
</Demo>

- `principal` is the amount of the loan. `rate` is the yearly interest in percent, and `months` is the number of payments.
- `start` is the month of the first payment, as `YYYY-MM`.
- All the payments are equal. The standard annuity formula gives them. A `rate` of 0 splits the principal into equal parts.
- Each row shows the month, the payment, the part for the principal, the part for interest, and the balance that is left. The last payment takes the rest, so the balance ends at exactly 0.
- `paid` is the number of payments that are paid. Those rows say "paid" and are gray.
- The line on top gives the total of all payments and the total interest. The table scrolls inside its frame, and its header stays in view.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format of the money and the months.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `number`, `month`, `payment`, `principal`, `interest`, `balance`, `paid`, and `totals` (a function).

The `amortize` function makes the rows. It is exported for your own views.

## Usage

```ts
import { BlessPaymentSchedule } from "blessing-ui";
```

## API

<PropsTable name="BlessPaymentSchedule" />

<script setup>
import PaymentScheduleBasic from "../demos/PaymentScheduleBasic.vue";
</script>
