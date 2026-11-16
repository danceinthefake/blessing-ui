---
title: Vitals panel
---

<script setup>
import VitalsPanelBasic from "../demos/VitalsPanelBasic.vue";
</script>

# Vitals panel

<p class="bless-lead">Heart rate, blood pressure, and other readings with the normal range</p>

Shows the latest body readings in a health or clinic app. The app gives the normal ranges. The component does not give medical advice.

<Demo title="Basic">
  <VitalsPanelBasic />
  <template #code>

<<< ../demos/VitalsPanelBasic.vue

  </template>
</Demo>

- `vitals` is a list of readings. Each reading has an `id`, a `label`, and a `value`. It can also have a `unit`, a `normal` range as `[low, high]`, and a `time`.
- The value is a number or text. Use text for a value such as blood pressure, "118/76".
- A number with a range shows "▲ High", "▼ Low", or "✓ Normal". A reading out of range also has a thick red edge, but the mark and the word carry the meaning.
- A bar shows where the value falls. The green band is the normal range. The bar is only for the eye, because the text says the same.
- `locale` sets the format of the numbers. Change the words with `labels` or a [label pack](../guide/translating): `title`, `low`, `high`, `normal`, and `range` (a function).

The `vitalState` function gives the state of a reading. It is exported for your own views.

## Usage

```ts
import { BlessVitalsPanel } from "blessing-ui";
```

## API

<PropsTable name="BlessVitalsPanel" />
