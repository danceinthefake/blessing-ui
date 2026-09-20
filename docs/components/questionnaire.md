---
title: Questionnaire
---

<script setup>
import QuestionnaireBasic from "../demos/QuestionnaireBasic.vue";
</script>

# Questionnaire

<p class="bless-lead">Multi-step single/multiple/freeform</p>

## When to use

A one-question-at-a-time form: onboarding, surveys, quizzes. Give it a list of questions and it handles the step header, the input for each type (single choice, multiple choice, free text), required-answer validation, skipping, keyboard shortcuts `1`–`9` for choices, and the progress bar. Answers collect into one object bound with `v-model`.

For a form where the user should see all fields at once, use `BlessForm` + `BlessField`. For a wizard with arbitrary panels, use `BlessStepper`.

<Demo title="Basic">
  <QuestionnaireBasic />
  <template #code>

<<< ../demos/QuestionnaireBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessQuestionnaire } from "blessing-ui";
```

## API

<PropsTable name="BlessQuestionnaire" />
