---
title: Answer compare
---

# Answer compare

<p class="bless-lead">Two answers side by side with a vote for the better one</p>

Lets people choose between two answers of an AI assistant, so the team learns which model or prompt works better.

<Demo title="Basic">
  <AnswerCompareBasic />
  <template #code>

<<< ../demos/AnswerCompareBasic.vue

  </template>
</Demo>

- `answers` is a pair. Each answer has a `text` and an optional `source`, such as the model or the prompt behind it.
- `prompt` shows the question above the answers.
- `blind` (on by default) hides the sources until the person votes, so the names do not change the vote.
- `v-model` is the vote: `a`, `b`, `tie`, or `bad`. The chosen button is pressed, and the better answer gets a frame and a check. A status line thanks the person.
- On a narrow screen, the answers go one under the other.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessAnswerCompare } from "blessing-ui";
```

## API

<PropsTable name="BlessAnswerCompare" />

<script setup>
import AnswerCompareBasic from "../demos/AnswerCompareBasic.vue";
</script>
