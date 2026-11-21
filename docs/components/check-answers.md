---
title: Check answers
---

# Check answers

<p class="bless-lead">The answers of a form in groups with a change link for each, and a statement to agree to before you send</p>

Lets a person read all their answers once more before they send a long form. It is the last page of a service, after a [saved form](./saved-form) or a set of questions.

<Demo title="Basic">
  <CheckAnswersBasic />
  <template #code>

<<< ../demos/CheckAnswersBasic.vue

  </template>
</Demo>

- `groups` is the list of groups. Each group has a `title` and `rows`. Each row has a `key`, a `label`, and a `value`.
- A value that is a list shows one item on each line. An empty value says "Not given".
- Each row has a change action. If the row has an `href`, it is a link. If not, it is a button that emits `change` with the key. Screen readers hear the label too, as in "Change Address".
- `declaration` adds a statement and a check box. If the person sends without the check, an error explains it, and the form does not send.
- "Accept and send" emits `submit`.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The page follows the "Check answers" pattern of the GOV.UK Design System.

## Usage

```ts
import { BlessCheckAnswers } from "blessing-ui";
```

## API

<PropsTable name="BlessCheckAnswers" />

<script setup>
import CheckAnswersBasic from "../demos/CheckAnswersBasic.vue";
</script>
