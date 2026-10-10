---
title: MessageScroller
---

<script setup>
import MessageScrollerBasic from "../demos/MessageScrollerBasic.vue";
</script>

# MessageScroller

<p class="bless-lead">Chat viewport</p>

The scrolling transcript of a chat. It opens at the latest message and follows new messages while you are at the bottom. It keeps your place while you read back. It loads history at the top.

Streamed, growing replies are followed too. Pair it with [Message](./message) and [Bubble](./bubble) for the rows and [Marker](./marker) for day separators and typing indicators.

<Demo title="Basic">
  <MessageScrollerBasic />
  <template #code>

<<< ../demos/MessageScrollerBasic.vue

  </template>
</Demo>

- It is a named log (`label`), so new messages are announced politely. While a reply is streaming in, set `aria-busy` on that message so it is read once when it is done, not word by word.
- The jump button appears after you scroll up. `@reach-top` asks for history, and `loadHistory(insert)` keeps your place while it is added. Scrolling does not animate under reduced motion.

## Usage

```ts
import { BlessMessageScroller } from "blessing-ui";
```

## API

<PropsTable name="BlessMessageScroller" />
