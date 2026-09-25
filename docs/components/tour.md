---
title: Tour
---

<script setup>
import TourBasic from "../demos/TourBasic.vue";
</script>

# Tour

<p class="bless-lead">Step-by-step spotlight walkthrough</p>

A few-step walkthrough of a new or changed screen, pointing at the parts that matter. Keep it short, let people skip it, and don't hide anything essential in it.

## When to use

A guided walkthrough for first runs and new features: each step points at an element by selector, dims everything else and cuts a spotlight around the target. Steps without a target render centred, which makes a good opening and closing frame.

Keep tours short — three to five stops — and make every step skippable. It composes with your own state: bind `v-model:open` to "user hasn't seen this yet" and `v-model:step` if you want to resume.

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
