---
title: Quality check
---

<script setup>
import QualityCheckBasic from "../demos/QualityCheckBasic.vue";
</script>

# Quality check

<p class="bless-lead">Pass or fail checks and measured values against their limits</p>

Records the inspection of one unit at a quality station. For the trend of a measure over many units, use the [control chart](./control-chart).

<Demo title="Basic">
  <QualityCheckBasic />
  <template #code>

<<< ../demos/QualityCheckBasic.vue

  </template>
</Demo>

- `items` is the list of checks. Each check has an `id` and a `label`. A check with a `min`, a `max`, or both is a measure, with an optional `unit`. A check without them is pass or fail.
- `v-model` holds the results by id: a `value` for a measure, or `pass` for the others.
- A measure inside its limits passes by itself. Outside them, it says "Out of limits" and is marked as not valid.
- A pass or fail check has two big buttons, as native radio buttons.
- Each check that fails has a dashed red frame and a tint. The status line on top counts the checks. If all are done, it also gives the result of the unit.
- "Save the check" emits `submit` with the results and a pass flag. The flag is `true` for a unit that passes. The button is off until each check is done.
- `locale` sets the format of the limits. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `checkPasses` function gives the result of one check. It is exported for your own views.

## Usage

```ts
import { BlessQualityCheck } from "blessing-ui";
```

## API

<PropsTable name="BlessQualityCheck" />
