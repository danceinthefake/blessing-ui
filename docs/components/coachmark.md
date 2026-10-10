---
title: Coachmark
---

<script setup>
import CoachmarkBasic from "../demos/CoachmarkBasic.vue";
</script>

# Coachmark

<p class="bless-lead">A "new" dot on one control, seen once</p>

A small pulsing mark on a feature that people have not met yet: a new button, a moved menu entry. It says what is new in a short bubble and goes away for good after a person sees it. For a walk through several things in order, use [Tour](./tour). For a message that must be read, use [Alert](./alert).

<Demo title="On a button">
  <CoachmarkBasic />
  <template #code>

<<< ../demos/CoachmarkBasic.vue

  </template>
</Demo>

- Wrap the element in `<BlessCoachmark text="…">`. The dot is a button named "New: …". It opens a bubble with the text and a **Got it** button, **Esc** closes the bubble.
- It disappears when dismissed. By default it also disappears when a person uses the wrapped element (any click inside it), because using it is seeing it. To keep it until **Got it**, use `:dismiss-on-use="false"`.
- `id="export"` remembers the dismissal in `localStorage`, so it shows once per browser. Without an `id`, `v-model:dismissed` is the only memory and it is yours to keep. The dot appears after mount, so a server-rendered page never flashes it.
- The pulse stops under `prefers-reduced-motion` (a still ring remains). `placement` picks the corner. The dot has a touch target larger than it looks.

## Usage

```ts
import { BlessCoachmark } from "blessing-ui";
```

## API

<PropsTable name="BlessCoachmark" />
