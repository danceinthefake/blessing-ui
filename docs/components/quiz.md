---
title: Quiz
---

# Quiz

<p class="bless-lead">Questions with choices, a check after each answer, and a score</p>

Tests what a learner knows, one question at a time. After each answer, the quiz shows the right choice and why. For a survey with no right answers, use the [questionnaire](./questionnaire).

<Demo title="Basic">
  <QuizBasic />
  <template #code>

<<< ../demos/QuizBasic.vue

  </template>
</Demo>

- `questions` is a list of questions. Each question has a `question`, a list of `choices`, the index of the right choice in `answer`, and an optional `explain`.
- The learner picks a choice and presses "Check". The right choice gets a check mark and a solid edge. A wrong pick gets a cross and a dashed edge. The choices then lock.
- A status line says "Right!" or gives the right answer, with the reason. Screen readers hear it.
- After the last question, the quiz shows the score and emits `finish` with the right answers and the total. "Start again" goes back to the first question.
- The choices of each question are native radio buttons in a group, and the focus moves to each new question. Change the words with `labels` or a [label pack](../guide/translating): `check`, `next`, `finish`, `restart`, `right`, and the functions `wrong`, `progress`, and `score`.

## Usage

```ts
import { BlessQuiz } from "blessing-ui";
```

## API

<PropsTable name="BlessQuiz" />

<script setup>
import QuizBasic from "../demos/QuizBasic.vue";
</script>
