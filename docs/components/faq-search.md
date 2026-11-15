---
title: FAQ search
---

<script setup>
import FaqSearchBasic from "../demos/FaqSearchBasic.vue";
</script>

# FAQ search

<p class="bless-lead">Questions and answers in folds, with a search that filters them</p>

Shows the common questions about a product or a show. A search keeps the questions that match, opens them, and marks the words. For folds with no search, use the [accordion](./accordion).

<Demo title="Basic">
  <FaqSearchBasic />
  <template #code>

<<< ../demos/FaqSearchBasic.vue

  </template>
</Demo>

- `items` is a list of questions, each with a `question` and an `answer`.
- The search looks in the questions and the answers, and the case does not matter. While a search runs, every match is open and the words that match are marked.
- Without a search, the reader opens and closes the questions.
- A status line says how many questions match, or that none does. Screen readers hear it.
- Each question is a native `details` element, so the keyboard opens it. Change the words with `labels` or a [label pack](../guide/translating): `search`, `none`, and `count` (a function of the matches and all questions).

## Usage

```ts
import { BlessFaqSearch } from "blessing-ui";
```

## API

<PropsTable name="BlessFaqSearch" />
