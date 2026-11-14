---
title: TypingIndicator
---

<script setup>
import TypingIndicatorBasic from "../demos/TypingIndicatorBasic.vue";
</script>

# TypingIndicator

<p class="bless-lead">Who is typing now, under a chat</p>

A line under a [message scroller](./message-scroller) or a comment box that says who is typing a reply. Your app knows who types, for example from a Phoenix channel event, and passes the names. For a person who is online but not typing, use a [badge](./badge) on the avatar instead.

<Demo title="Basic">
  <TypingIndicatorBasic />
  <template #code>

<<< ../demos/TypingIndicatorBasic.vue

  </template>
</Demo>

- `names` holds the people who type now. One name, two names, and more than two each have their own sentence: "Ana and 3 others are typing…". An empty list shows nothing.
- The line is a status, so a screen reader speaks a change without moving focus. The status stays in the page while it is empty, so the first name is spoken too.
- The three dots pulse, and they stop under reduced motion. They are hidden from screen readers.
- Change the words with `labels` or a [label pack](../guide/translating): `one(name)`, `two(a, b)`, and `many(name, more)`.

## Usage

```ts
import { BlessTypingIndicator } from "blessing-ui";
```

## API

<PropsTable name="BlessTypingIndicator" />
