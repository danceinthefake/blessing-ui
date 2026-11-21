---
title: Work instructions
---

# Work instructions

<p class="bless-lead">The steps of a job with a picture for each step</p>

Guides an operator through a job at a station, one step at a time. For the steps of a form, use the [stepper](./stepper).

<Demo title="Basic">
  <WorkInstructionsBasic />
  <template #code>

<<< ../demos/WorkInstructionsBasic.vue

  </template>
</Demo>

- `steps` is the list of steps. Each step has a `title` and a `body`. It can also have an `image` with its `alt` text, and a `caution`.
- A caution shows in a box with the word "Caution" before the body, so the operator reads it first.
- `v-model` is the index of the step on the screen. A bar on top shows the done steps and the current one, and a line counts them, such as "Step 2 of 4".
- The Back and Next buttons are big, for gloves. On the last step, Next becomes Finish and emits `finish`.
- When the step changes, the focus moves to its title, so a screen reader reads the new step.
- `job` names the job on top. Change the words with `labels` or a [label pack](../guide/translating): `title`, `back`, `next`, `finish`, `caution`, and `step` (a function).

## Usage

```ts
import { BlessWorkInstructions } from "blessing-ui";
```

## API

<PropsTable name="BlessWorkInstructions" />

<script setup>
import WorkInstructionsBasic from "../demos/WorkInstructionsBasic.vue";
</script>
