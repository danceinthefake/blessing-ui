---
title: Production counter
---

<script setup>
import ProductionCounterBasic from "../demos/ProductionCounterBasic.vue";
</script>

# Production counter

<p class="bless-lead">Good and scrap pieces against the target, with big buttons for a station</p>

Counts the output of a station on a tablet at the line. Scrap is a piece that fails and goes to waste. The buttons are big, so an operator with gloves can hit them.

<Demo title="Basic">
  <ProductionCounterBasic />
  <template #code>

<<< ../demos/ProductionCounterBasic.vue

  </template>
</Demo>

- `v-model:good` and `v-model:scrap` hold the counts. "+1 Good" and "+1 Scrap" add one each.
- `target` is the number of good pieces for the shift. A bar shows how far the good count is.
- The yield is the good pieces as a percent of all pieces.
- "Undo the last count" takes back the last taps, one at a time.
- After each tap, a hidden status line says both counts, so a screen reader user hears the result.
- `locale` sets the format of the numbers. Change the words with `labels` or a [label pack](../guide/translating): `title`, `good`, `scrap`, `addGood`, `addScrap`, `undo`, and the functions `target`, `yield`, and `said`.

## Usage

```ts
import { BlessProductionCounter } from "blessing-ui";
```

## API

<PropsTable name="BlessProductionCounter" />
