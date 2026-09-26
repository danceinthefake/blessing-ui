---
title: Tour
---

<script setup>
import TourBasic from "../demos/TourBasic.vue";
</script>

# Tour

<p class="bless-lead">Step-by-step spotlight walkthrough</p>

A few-step walkthrough of a new or changed screen, pointing at the parts that matter. Keep it short, let people skip it, and don't hide anything essential in it.

Three to five stops is plenty. Bind `v-model:open` to "hasn't seen this yet" and `v-model:step` to resume where they left off; a step without a target sits centred, which makes a good opening and closing frame.

<Demo title="Basic">
  <TourBasic />
  <template #code>

<<< ../demos/TourBasic.vue

  </template>
</Demo>

- Each step points at `target` (a selector) with a spotlight; without a target it sits in the middle. The step panel takes focus; Esc skips; focus returns to where it was when the tour ends.
- It scrolls the target into view, without animation under reduced motion. `@finish` / `@skip` say how it ended.

## Usage

```ts
import { BlessTour } from "blessing-ui";
```

## API

<PropsTable name="BlessTour" />
