---
title: Measure converter
---

# Measure converter

<p class="bless-lead">An amount in one unit of length, mass, volume, or temperature in another</p>

Does one small job fast in a tools site or a recipe page. For the packs and pieces of a stock item, use the [unit converter](./unit-converter).

<Demo title="Basic">
  <MeasureConverterBasic />
  <template #code>

<<< ../demos/MeasureConverterBasic.vue

  </template>
</Demo>

- `v-model:kind` is `length`, `mass`, `volume`, or `temperature`. When the kind changes, the units change to a common pair, such as kilograms and pounds.
- `v-model:amount`, `v-model:from`, and `v-model:to` hold the amount and the two units. The swap button turns the units around.
- The units are metric and US: millimeters to miles, grams to stones, milliliters to US gallons, and Celsius, Fahrenheit, and kelvins. The factors are exact by definition.
- The names of the units and the result come from `Intl` in the language of `locale`. The result keeps six significant digits, and screen readers hear it when it changes.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `convertMeasure` function and the `MEASURES` table do the math. They are exported for your own views.

## Usage

```ts
import { BlessMeasureConverter } from "blessing-ui";
```

## API

<PropsTable name="BlessMeasureConverter" />

<script setup>
import MeasureConverterBasic from "../demos/MeasureConverterBasic.vue";
</script>
