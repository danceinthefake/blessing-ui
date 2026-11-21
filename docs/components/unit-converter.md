---
title: Unit converter
---

# Unit converter

<p class="bless-lead">An amount in one unit of measure and its value in another, such as boxes and pieces</p>

Converts between the packs of one product in a warehouse or an ERP. For money, use the [currency converter](./currency-converter).

<Demo title="Basic">
  <UnitConverterBasic />
  <template #code>

<<< ../demos/UnitConverterBasic.vue

  </template>
</Demo>

- `units` is the list of units of one product. Each unit has an `id`, a `name`, and `perBase`: how many of the base unit are in one of it. The base unit has a `perBase` of 1.
- `v-model:amount`, `v-model:from`, and `v-model:to` hold the amount and the two units. The ⇄ button swaps the units.
- The result is an `output` element, so screen readers hear each new value.
- "In whole units" splits the amount into the largest whole units first, such as "2 cartons, 3 boxes, 5 pcs". A part that is not whole stays in the smallest unit.
- `locale` sets the format of the numbers. Change the words with `labels` or a [label pack](../guide/translating): `amount`, `from`, `to`, `swap`, `result`, and `split`.

The `splitUnits` function does the split. It is exported for your own views.

## Usage

```ts
import { BlessUnitConverter } from "blessing-ui";
```

## API

<PropsTable name="BlessUnitConverter" />

<script setup>
import UnitConverterBasic from "../demos/UnitConverterBasic.vue";
</script>
