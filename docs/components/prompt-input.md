---
title: Prompt input
---

<script setup>
import PromptInputBasic from "../demos/PromptInputBasic.vue";
</script>

# Prompt input

<p class="bless-lead">The text box of a chat with an assistant</p>

The box where a person writes to an assistant. It grows with the text, sends on Enter, and turns its send button into a stop button while a reply comes in. Put the messages above it with [`BlessBubble`](./bubble) in a [`BlessMessageScroller`](./message-scroller), and a reply that comes in part by part with [`BlessStreamingText`](./streaming-text).

<Demo title="Basic">
  <PromptInputBasic />
  <template #code>

<<< ../demos/PromptInputBasic.vue

  </template>
</Demo>

- Enter sends, and Shift+Enter adds a line. Enter that picks a word in an input method (for example for Japanese or Chinese) does not send.
- `send` gets `{ text, files }`, with the text trimmed. Then the box is empty again. The box does not send when it is empty, when it is `disabled`, or while it is `busy`.
- `v-model` holds the text, so the app can keep a draft. `v-model:files` holds the files.
- The box grows with the text up to `max-rows` lines (default 8), and then it scrolls. It uses CSS `field-sizing`. In a browser without it, the box keeps one line and scrolls.
- `busy` turns the send button into a stop button, which emits `stop`. The text box stays open, so a person can write the next message.
- `attach` shows a button that opens the file picker. Set it to a text such as `"image/*"` to limit the file types. Files can also be dropped on the box. Each file shows as an [attachment](./attachment) chip that a person can remove.
- The `actions` slot puts more buttons in the bar, for example a model picker.
- Change the words with `labels` or a [label pack](../guide/translating): `label` (the name of the box for screen readers), `placeholder`, `send`, `stop`, `attach`, and `remove`.

## Usage

```ts
import { BlessPromptInput } from "blessing-ui";
```

## API

<PropsTable name="BlessPromptInput" />
