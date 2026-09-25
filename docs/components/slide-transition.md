---
title: SlideTransition
---

<script setup>
import SlideTransitionBasic from "../demos/SlideTransitionBasic.vue";
</script>

# SlideTransition

<p class="bless-lead">Height transition for v-if / v-show</p>

Wrap one element that appears and disappears — an expanding row, a detail panel, an inline message — and it slides open from 0 to its natural height and back, without a fixed `max-height`. For a disclosure with its own button, [Collapsible](./collapsible) already does this.

<Demo title="Basic">
  <SlideTransitionBasic />
  <template #code>

<<< ../demos/SlideTransitionBasic.vue

  </template>
</Demo>

- `duration` in ms (300 by default). Under reduced motion, or with `duration` 0, the element shows and hides at once.
- The slot needs a single root element. Its padding stays visible at height 0, so put the padding on an inner wrapper to close fully.

## Usage

```ts
import { BlessSlideTransition } from "blessing-ui";
```

## API

<PropsTable name="BlessSlideTransition" />
