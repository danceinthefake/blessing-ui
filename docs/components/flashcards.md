---
title: Flashcards
---

# Flashcards

<p class="bless-lead">Cards with a question and an answer, to learn by memory</p>

Shows one card at a time. The learner tries to remember the answer, then shows it. For questions with choices and a score, use the [quiz](./quiz).

<Demo title="Basic">
  <FlashcardsBasic />
  <template #code>

<<< ../demos/FlashcardsBasic.vue

  </template>
</Demo>

- `cards` is a list of cards. Each card has a `front` and a `back`.
- A click on the card, or on "Show the answer", shows the back under the front. Screen readers hear the answer.
- After the answer shows, the learner picks "I know it" or "Again". "Again" puts the card at the end of the deck, so it comes back.
- If no cards are left, the deck shows how many cards the learner knew at the first try. It also emits `finish` with that number and the total. "Start again" goes back to the full deck.
- Each answer emits `answer` with the card, `true` for "I know it", and whether it was the first try. Use it to plan the next review, for example with Leitner boxes.
- New `cards`, for example after they load, start a new round.
- Change the words with `labels` or a [label pack](../guide/translating): `flip`, `know`, `again`, `restart`, and the functions `progress` and `done`.

## Usage

```ts
import { BlessFlashcards } from "blessing-ui";
```

## API

<PropsTable name="BlessFlashcards" />

<script setup>
import FlashcardsBasic from "../demos/FlashcardsBasic.vue";
</script>
