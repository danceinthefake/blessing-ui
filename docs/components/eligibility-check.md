---
title: Eligibility check
---

# Eligibility check

<p class="bless-lead">Questions one at a time that lead to a result, with a way back</p>

Tells a person if they can apply for a service before they start a long form. A short check saves their time and the time of your staff.

<Demo title="Basic">
  <EligibilityCheckBasic />
  <template #code>

<<< ../demos/EligibilityCheckBasic.vue

  </template>
</Demo>

- `questions` is the list of questions. The first one is the start. Each question has an `id`, a `text`, an optional `hint`, and `options`.
- Each option has a `label` and a `next` id. The next id is another question or an outcome.
- `outcomes` is the list of results. Each has an `id`, a `title`, an optional `body`, `eligible`, and an optional link with `href` and `cta`.
- One question shows at a time, as a group of radio buttons. Continue without a choice shows an error.
- After each step, the focus moves to the new question or the result, so screen readers read it.
- Back goes to the question before, with its answer still chosen. The result says "You can apply" or "You cannot apply", and it has Back and Start again.
- At a result, the check emits `result` with the outcome id and the answers by question id.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessEligibilityCheck } from "blessing-ui";
```

## API

<PropsTable name="BlessEligibilityCheck" />

<script setup>
import EligibilityCheckBasic from "../demos/EligibilityCheckBasic.vue";
</script>
