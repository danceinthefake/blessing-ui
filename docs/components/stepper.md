---
title: Stepper
---

<script setup>
import StepperBasic from "../demos/StepperBasic.vue";
</script>

# Stepper

<p class="bless-lead">Steps header + panels + next / back</p>


A task split into ordered steps with one panel at a time — checkout, onboarding, a setup wizard. Use it when each step depends on the one before; a single long form is often simpler.
<Demo title="Basic">
  <StepperBasic />
  <template #code>

<<< ../demos/StepperBasic.vue

  </template>
</Demo>

- Next / Back / Finish buttons by default (`labels` to rename, `#actions` to replace). On each step change focus moves to the panel, so the new step is read.
- `linear` (default) lets the header go back to completed steps only; `:linear="false"` lets people jump to any step.

## Usage

```ts
import { BlessStepper } from "blessing-ui";
```

## API

<PropsTable name="BlessStepper" />
