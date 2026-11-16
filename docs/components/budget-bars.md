---
title: Budget bars
---

<script setup>
import BudgetBarsBasic from "../demos/BudgetBarsBasic.vue";
</script>

# Budget bars

<p class="bless-lead">The money spent against the plan for each category, with what is left</p>

Shows a budget at a glance in a finance or team app. Each category has a bar, and a total row comes last. For the use of a plan limit, such as storage, use [quota usage](./quota-usage).

<Demo title="Basic">
  <BudgetBarsBasic />
  <template #code>

<<< ../demos/BudgetBarsBasic.vue

  </template>
</Demo>

- `budgets` is a list of categories. Each category has a `name`, the money `spent`, and the `budget`.
- Each row shows "spent of budget", a bar, and the money that is left. If the spending is more than the budget, the line says "over", and the bar is full and striped. The color only repeats this.
- The last row is the total of all the categories.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format. The amounts have no decimals.
- The bars are hidden from screen readers, because the text says the same. Change the words with `labels` or a [label pack](../guide/translating): `title`, `total`, and the functions `of`, `left`, and `over`.

## Usage

```ts
import { BlessBudgetBars } from "blessing-ui";
```

## API

<PropsTable name="BlessBudgetBars" />
