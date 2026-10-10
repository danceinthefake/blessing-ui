---
title: OnboardingChecklist
---

<script setup>
import OnboardingChecklistBasic from "../demos/OnboardingChecklistBasic.vue";
</script>

# OnboardingChecklist

<p class="bless-lead">The few steps to get started, with progress that stays</p>

A short list of first steps (fill in a profile, invite someone, publish a page), with a progress bar. It remembers where the person got to. Use it for the handful of things that a new account needs to do. For a one-time walk through the screen, use [Tour](./tour). For steps inside one task, use [Stepper](./stepper) or [Steps](./steps).

<Demo title="Three steps">
  <OnboardingChecklistBasic />
  <template #code>

<<< ../demos/OnboardingChecklistBasic.vue

  </template>
</Demo>

- `items` are `{ id, label, description?, action? }`. `v-model:done` is the ids that are finished. Each step is a real checkbox, so it works by keyboard and is announced. Ticking is the person's to do, and your code can add ids when the app sees the work done.
- `action` adds a button ("Open", "Start") that emits `select` with the item (take them to the place) and goes away once the step is done. `complete` fires once when the last step is ticked, and a closing line appears (`#complete` replaces it).
- The header folds the list away (`v-model:collapsed`, `aria-expanded`). The × dismisses it for good (`v-model:dismissed`, `dismiss`). `persist="welcome"` keeps progress, folded state and dismissal in `localStorage`, read after mount so a server-rendered page agrees.
- `floating` pins it to the bottom corner of the window. The progress bar is named "2 of 5 done" for screen readers. `labels` translates it and the other wording.

## Usage

```ts
import { BlessOnboardingChecklist } from "blessing-ui";
```

## API

<PropsTable name="BlessOnboardingChecklist" />
