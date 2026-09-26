---
title: Questionnaire
---

<script setup>
import QuestionnaireBasic from "../demos/QuestionnaireBasic.vue";
</script>

# Questionnaire

<p class="bless-lead">Multi-step single/multiple/freeform</p>

A short survey, one question at a time — onboarding questions, feedback, a quiz. For a form people fill in at once, use [Form](./form) with [Field](./form)s.

It handles the step header, the input for each question type, required answers, skipping and the progress bar; answers collect into one object bound with `v-model`. For a wizard with arbitrary panels, [Stepper](./stepper).

<Demo title="Basic">
  <QuestionnaireBasic />
  <template #code>

<<< ../demos/QuestionnaireBasic.vue

  </template>
</Demo>

- Questions are `single`, `multiple` or `freeform`; `required` (default) blocks Next with a message. On each step focus moves to the new question, so it is read.
- With `shortcuts`, 1–9 pick choices (Ctrl / ⌘ / Alt + digit stay with the browser).

## Usage

```ts
import { BlessQuestionnaire } from "blessing-ui";
```

## API

<PropsTable name="BlessQuestionnaire" />
