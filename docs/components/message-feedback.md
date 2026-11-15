---
title: Message feedback
---

<script setup>
import MessageFeedbackBasic from "../demos/MessageFeedbackBasic.vue";
</script>

# Message feedback

<p class="bless-lead">Good, bad, copy, and retry buttons under a reply</p>

Lets the reader mark a reply of an assistant as good or bad, copy it, or ask for a new one. After a bad mark, a small form asks what was wrong. For suggested next questions, use the [suggestions](./suggestions).

<Demo title="Basic">
  <MessageFeedbackBasic />
  <template #code>

<<< ../demos/MessageFeedbackBasic.vue

  </template>
</Demo>

- `v-model:rating` is `good`, `bad`, or none. A click on the pressed mark clears it. A pressed mark is filled, so the state is more than a color.
- A good mark emits `feedback` with `{ rating: "good" }` at once.
- A bad mark opens a form. The reader can pick one of the `reasons` and type a note. "Send" emits `feedback` with `{ rating: "bad", reason, note }`.
- `copy` is the text of the reply. With it, a copy button shows. `retry` shows a button that emits `retry`.
- The buttons have only icons, so each one has a name for screen readers and a tooltip. A hidden status line says "Thanks for the feedback" and "Copied".
- Change the words with `labels` or a [label pack](../guide/translating): `good`, `bad`, `copy`, `copied`, `retry`, `ask`, `note`, `send`, `cancel`, and `thanks`. The `reasons` are your own words, so translate them yourself.

## Usage

```ts
import { BlessMessageFeedback } from "blessing-ui";
```

## API

<PropsTable name="BlessMessageFeedback" />
