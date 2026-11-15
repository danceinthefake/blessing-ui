---
title: Streaming text
---

<script setup>
import StreamingTextBasic from "../demos/StreamingTextBasic.vue";
</script>

# Streaming text

<p class="bless-lead">Text that comes in part by part, with a caret</p>

Shows the reply of an assistant while it comes in, for example from a model that sends a few words at a time. Put it in a [bubble](./bubble), under a [prompt input](./prompt-input).

<Demo title="Basic">
  <StreamingTextBasic />
  <template #code>

<<< ../demos/StreamingTextBasic.vue

  </template>
</Demo>

- `text` is all the text that came in so far. Add each new part to it. `done` tells the component that the last part came in.
- A caret shows at the end of the text until `done`. It stops blinking when the system asks for reduced motion.
- Parts often come in at an uneven rate. `pace` shows the text at an even rate (letters a second) between parts, and it moves faster when it is far behind. `done` shows the rest at once. With reduced motion, each part shows at once.
- If `text` does not continue the old text, for example for a new reply, the text starts over.
- The text keeps its line breaks. For Markdown, use the default slot, which gets the shown text: `<template #default="{ text }"><BlessMarkdown :source="text" :lexer /></template>`.
- The text is a polite live region with `aria-busy` while text comes in, so screen readers wait and read the full reply, not each part.

## Usage

```ts
import { BlessStreamingText } from "blessing-ui";
```

## API

<PropsTable name="BlessStreamingText" />
