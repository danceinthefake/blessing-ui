---
title: Lesson path
---

# Lesson path

<p class="bless-lead">The lessons of a course as a path, done, current, or locked</p>

Shows a learner where they are in a course and which lesson comes next. The nodes swing left and right, so the list reads as a path. For the steps of a form, use the [stepper](./stepper).

<Demo title="Basic">
  <LessonPathBasic />
  <template #code>

<<< ../demos/LessonPathBasic.vue

  </template>
</Demo>

- `lessons` is a list of lessons in order. Each lesson has an `id`, a `title`, and an optional `meta` line and `done`.
- The first lesson that is not done is the current one. The lessons after it are locked.
- Each state has a mark and a word: ✓ and "done", ▶ and "start here", or a lock and "locked". The state does not rest on the color.
- A click on a done or current lesson emits `select` with its id. A locked lesson is a disabled button.
- The path is a navigation region with a line that counts the done lessons. Change the words with `labels` or a [label pack](../guide/translating): `title`, `done`, `current`, `locked`, and `progress` (a function).

## Usage

```ts
import { BlessLessonPath } from "blessing-ui";
```

## API

<PropsTable name="BlessLessonPath" />

<script setup>
import LessonPathBasic from "../demos/LessonPathBasic.vue";
</script>
