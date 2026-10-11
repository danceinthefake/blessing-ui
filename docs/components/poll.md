---
title: Poll
---

<script setup>
import PollBasic from "../demos/PollBasic.vue";
</script>

# Poll

<p class="bless-lead">One-question vote with results</p>

A question with a few answers, and the results after a person votes. Use it for a quick check of opinion. For a long form with many questions, use [Questionnaire](./questionnaire).

<Demo title="Basic">
  <PollBasic />
  <template #code>

<<< ../demos/PollBasic.vue

  </template>
</Demo>

- Before the vote, the poll is a radio group and a **Vote** button. The button waits for a choice.
- `v-model` holds the value that this person voted for. When it is set, or when `closed` is true, the poll shows the results. Set it from storage to show the results to a person who already voted.
- `vote` fires with the value. The poll does not count votes. Your server counts them, and you pass the new totals in `options[].votes`. Votes include the vote of this person.
- Each result shows the percent and the number of votes, as text. A screen reader gets the same text as the bars. The bar of your own vote takes the accent color, because color means chosen.
- `labels` replaces the English words: `vote`, `yours`, and `votes(n)` for the plural.

## Usage

```ts
import { BlessPoll } from "blessing-ui";
```

## API

<PropsTable name="BlessPoll" />
