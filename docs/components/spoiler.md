---
title: Spoiler
---

# Spoiler

<p class="bless-lead">Text hidden under a blur until a click shows it</p>

Hides a plot twist or an answer until the reader asks for it. It works for a few words in a line or for a whole block. To hide long text for space and not for surprise, use [read more](./read-more).

<Demo title="Basic">
  <SpoilerBasic />
  <template #code>

<<< ../demos/SpoilerBasic.vue

  </template>
</Demo>

- Put the hidden text in the default slot. While it is hidden, the words are a blur on a gray band, and the reader cannot select them.
- A click, Enter, or Space shows the text. It stays shown. `v-model:shown` reads or sets the state.
- `block` makes a block with a visible "Show the spoiler" badge, for a paragraph or more. Without it, the spoiler sits in a line of text.
- `hint` says what the text is about, for example "the end of episode 41". The button adds it to its name.
- While the text is hidden, screen readers and the keyboard cannot reach it, so it is not read aloud by accident. After the reveal, the focus goes to the text. Change the words with `labels` or a [label pack](../guide/translating): `show`, and `showAbout` (a function of the hint).

## Usage

```ts
import { BlessSpoiler } from "blessing-ui";
```

## API

<PropsTable name="BlessSpoiler" />

<script setup>
import SpoilerBasic from "../demos/SpoilerBasic.vue";
</script>
