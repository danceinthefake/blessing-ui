---
title: InputNumber
---

<script setup>
import InputNumberBasic from "../demos/InputNumberBasic.vue";
</script>

# InputNumber

<p class="bless-lead">Number with ± steppers and Intl format</p>

For amounts, quantities and prices: values you count or add up. Something that is merely made of digits — a phone number, a postcode, a card number — is not a number; use [InputMask](./input-mask) or [Input](./input).

<Demo title="Basic">
  <InputNumberBasic />
  <template #code>

<<< ../demos/InputNumberBasic.vue

  </template>
</Demo>

- `format` (any `Intl.NumberFormat` options) applies while the field isn't focused; on focus you edit the plain number, with the locale's decimal mark (`1,5` in `de-DE`).
- `step` counts from `min`, as in HTML: `min=5 step=10` gives 5, 15, 25. The value snaps to a step on blur.
- Keys: ↑/↓ one step, Page Up/Down ten, Home/End to `min`/`max` when set. Screen readers hear the formatted value with prefix and suffix.
- `name` submits the plain number with the form (`1980`), not the formatted text (`￥1,980`).
- `:buttons="false"` when the steppers make no sense, like a large price.

## Usage

```ts
import { BlessInputNumber } from "blessing-ui";
```

## API

<PropsTable name="BlessInputNumber" />
