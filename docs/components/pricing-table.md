---
title: Pricing table
---

# Pricing table

<p class="bless-lead">Plans side by side, with a monthly or yearly switch</p>

Shows the plans of a product next to each other, so a person can compare the prices and features and pick one. For a list of features in rows across plans, use the [table](./table).

<Demo title="Basic">
  <PricingTableBasic />
  <template #code>

<<< ../demos/PricingTableBasic.vue

  </template>
</Demo>

- `plans` is a list of `{ id, name, description, price, features, featured, cta }`. `price` has a `monthly` and a `yearly` amount. A price of 0 shows "Free".
- The switch at the top changes `v-model:period` between `monthly` and `yearly`. Next to it, "Save 17%" shows the best saving of a year over twelve months, from all the plans.
- `featured` puts a border in the accent color and a badge on one plan, and gives it a filled button. The other plans get an outline button.
- The button emits `select` with the plan and the period. `cta` sets the text of the button on one plan, for example "Talk to us".
- The prices use `Intl.NumberFormat`: `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format (default `en`).
- The plans wrap to more rows on a small screen. Each plan is an item in a list, so screen readers say how many plans there are.
- Change the words with `labels` or a [label pack](../guide/translating): `period`, `monthly`, `yearly`, `perMonth`, `perYear`, `free`, `featured`, `choose`, and `save` (a function of the percent).

## Usage

```ts
import { BlessPricingTable, type BlessPricingPeriod, type BlessPricingPlan } from "blessing-ui";
```

## API

<PropsTable name="BlessPricingTable" />

<script setup>
import PricingTableBasic from "../demos/PricingTableBasic.vue";
</script>
