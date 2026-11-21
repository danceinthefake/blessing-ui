---
title: Comparison table
---

# Comparison table

<p class="bless-lead">Features by plan, with checks, dashes, and values</p>

Compares plans or products feature by feature, under the [pricing table](./pricing-table). The names of the plans stay at the top while the reader scrolls a long list.

<Demo title="Basic">
  <ComparisonTableBasic />
  <template #code>

<<< ../demos/ComparisonTableBasic.vue

  </template>
</Demo>

- `plans` is a list of columns. Each plan has a `key`, a `label`, an optional `note` such as the price, and an optional `highlight`.
- `rows` is a list of features. Each row has a `label` and `values` by plan key: `true` shows a check, `false` or no value shows a dash, and a text shows as it is. A row with `group` is a heading for the rows after it.
- The plan with `highlight` has an accent line on top and a gray column.
- It is a native table. Screen readers hear "Included" and "Not included" in place of the check and the dash. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `title`, `feature`, `yes`, and `no`.

## Usage

```ts
import { BlessComparisonTable } from "blessing-ui";
```

## API

<PropsTable name="BlessComparisonTable" />

<script setup>
import ComparisonTableBasic from "../demos/ComparisonTableBasic.vue";
</script>
