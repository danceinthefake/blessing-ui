---
title: CountUp
---

<script setup>
import CountUpBasic from "../demos/CountUpBasic.vue";
</script>

# CountUp

<p class="bless-lead">Numbers that roll to a new value</p>

A figure that travels to its value instead of appearing — a dashboard total, a score, a price that just changed. Use it for a number the reader is meant to notice change; for the plain number everywhere else, just print it.

<Demo title="Basic">
  <CountUpBasic />
  <template #code>

<<< ../demos/CountUpBasic.vue

  </template>
</Demo>

- It counts from 0 when first shown (`:appear="false"` starts on the value) and, whenever `value` changes, on from the number it has reached. The easing is a fast start that settles.
- Formatting is `Intl.NumberFormat`: `locale` picks separators, `options` the style (`{ style: "currency", currency: "IDR" }`, `{ style: "percent" }`, `{ maximumFractionDigits: 1 }`).
- `odometer` rolls every digit in its own column instead of counting through the values; separators and symbols stay put.
- Screen readers get the final number at once, never the count. With `prefers-reduced-motion`, or `duration` of 0, it just shows the value.

## Usage

```ts
import { BlessCountUp } from "blessing-ui";
```

## API

<PropsTable name="BlessCountUp" />
