---
title: Timeline
---

<script setup>
import TimelineBasic from "../demos/TimelineBasic.vue";
</script>

# Timeline

<p class="bless-lead">Vertical rail of dated events</p>

A history read top to bottom — release notes, an order's progress, a production diary. For steps the user is going through right now, use [Steps](./steps) or [Stepper](./stepper).

<Demo title="Basic">
  <TimelineBasic />
  <template #code>

<<< ../demos/TimelineBasic.vue

  </template>
</Demo>

- `time` is shown as written; add `datetime` (`2015-01`) so the `<time>` element carries a machine-readable date.
- A dot's `color` is decoration only. If it means something (failed, shipped), say so in the title too.
- The default slot replaces the body of every item and gets `{ item, index }`; `#dot` draws inside the dot.

## Usage

```ts
import { BlessTimeline } from "blessing-ui";
```

## API

<PropsTable name="BlessTimeline" />
