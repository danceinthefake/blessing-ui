---
title: Input
---

<script setup>
import InputBasic from "../demos/InputBasic.vue";
import InputOtpBasic from "../demos/InputOtpBasic.vue";
import InputSizes from "../demos/InputSizes.vue";
import InputStates from "../demos/InputStates.vue";
</script>

# Input

<p class="bless-lead">Text-like input</p>

<Demo title="Basic">
  <InputBasic />
  <template #code>

<<< ../demos/InputBasic.vue

  </template>
</Demo>

<Demo title="Otp Basic">
  <InputOtpBasic />
  <template #code>

<<< ../demos/InputOtpBasic.vue

  </template>
</Demo>

<Demo title="Sizes">
  <InputSizes />
  <template #code>

<<< ../demos/InputSizes.vue

  </template>
</Demo>

<Demo title="States">
  <InputStates />
  <template #code>

<<< ../demos/InputStates.vue

  </template>
</Demo>

## Usage

```ts
import { BlessInput } from "blessing-ui";
```

## API

<PropsTable name="BlessInput" />
