---
title: Reactions
---

<script setup>
import ReactionsBasic from "../demos/ReactionsBasic.vue";
</script>

# Reactions

<p class="bless-lead">Emoji reactions with counts under a post</p>

Lets readers react to a post or a message with an emoji. Each reaction shows its count. A click adds or removes the reaction of the reader, and a button opens the [emoji picker](./emoji-picker) for a new one.

<Demo title="Basic">
  <ReactionsBasic />
  <template #code>

<<< ../demos/ReactionsBasic.vue

  </template>
</Demo>

- `v-model` is a list of reactions. Each reaction has an `emoji` and a `count`. If the reader is one of the people who reacted, set `active` to true. It is the `BlessReaction` type of the [chat bubble](./bubble).
- A click on a reaction adds the reader to it or removes the reader from it, and changes `count` and `active`. A reaction with a count of zero goes away. Each click emits `toggle` with the emoji and the new state. Send it to your server.
- The last button opens the emoji picker. A picked emoji adds a new reaction, or joins the reaction that has it. `:addable="false"` hides this button.
- `max` sets how many reactions one reader can add (default 0, no limit). At the limit, the other buttons are disabled.
- The reaction of the reader has the accent border and a bold count. Each button is a toggle with `aria-pressed`, and its name says the emoji and the count. Change the words with `labels` or a [label pack](../guide/translating): `add`, `group`, and `reaction` (a function of the emoji and the count).

## Usage

```ts
import { BlessReactions } from "blessing-ui";
```

## API

<PropsTable name="BlessReactions" />
