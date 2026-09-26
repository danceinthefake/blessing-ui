---
title: Progress
---

<script setup>
import ProgressBasic from "../demos/ProgressBasic.vue";
</script>

# Progress

<p class="bless-lead">Bar, determinate or not</p>

The linear one: a task with a known length and room across the page — an upload, a form's steps, a quota. Pass `value` (against `max`, default 100); omit it for an indeterminate bar that slides until you know more. `showValue` prints the percentage at the end of the head, or whatever `format(value, max)` returns. Under `prefers-reduced-motion` the indeterminate bar holds still at 40%. When `value` reaches `max` the bar is done: it outgrows its track and leans past the end — the one place a progress bar is allowed to break its frame.

Always name it: a visible `label`, or at least `label` as the accessible name — a bar with no name is just a line. In a square space, [CircularProgress](./circular-progress); for the page-level "something's loading" line, [LoadingBar](./loading-bar); for parts of a whole, [MeterGroup](./meter-group).

<Demo title="Basic">
  <ProgressBasic />
  <template #code>

<<< ../demos/ProgressBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessProgress } from "blessing-ui";
```

## API

<PropsTable name="BlessProgress" />
