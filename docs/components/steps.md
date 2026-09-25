---
title: Steps
---

<script setup>
import StepsBasic from "../demos/StepsBasic.vue";
</script>

# Steps

<p class="bless-lead">Stepper with done / current / upcoming</p>


Where someone is in a sequence — the header of a [Stepper](./stepper), or an order's status. The current step has `aria-current="step"`.
<Demo title="Basic">
  <StepsBasic />
  <template #code>

<<< ../demos/StepsBasic.vue

  </template>
</Demo>

- `clickable` turns completed steps into buttons (`@select`); `clickable="all"` makes every other step one.
- `orientation="vertical"` stacks them with room for `description`s.

## Usage

```ts
import { BlessSteps } from "blessing-ui";
```

## API

<PropsTable name="BlessSteps" />
