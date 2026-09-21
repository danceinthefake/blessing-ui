---
title: CircularProgress
---

<script setup>
import CircularProgressBasic from "../demos/CircularProgressBasic.vue";
</script>

# CircularProgress

<p class="bless-lead">Ring progress, determinate or spinning</p>

A gauge — round because a gauge _is_ round, one of the three deliberate circles in the system (with the radio and the knob). Pass `value` for a determinate ring; omit it and the arc spins. Under `prefers-reduced-motion` it spins at half speed rather than stopping: a loader that stops reads as finished.

Use it where a percentage matters and space is square — a tile, an upload row, a card corner. For a task with room across the page, [Progress](./progress) is the linear one; for "busy" with no percentage, [Spinner](./spinner) is smaller and cheaper. `showValue` puts the number in the ring; it's legible from `size` 48 up (the text is 26% of the size), so below that put the number beside it. `format` or the default slot (`{ value, percent }`) changes the text.

<Demo title="Basic">
  <CircularProgressBasic />
  <template #code>

<<< ../demos/CircularProgressBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessCircularProgress } from "blessing-ui";
```

## API

<PropsTable name="BlessCircularProgress" />
