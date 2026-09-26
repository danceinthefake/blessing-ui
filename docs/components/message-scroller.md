---
title: MessageScroller
---

<script setup>
import MessageScrollerBasic from "../demos/MessageScrollerBasic.vue";
</script>

# MessageScroller

<p class="bless-lead">Chat viewport</p>

The scrolling transcript of a chat: it opens at the latest message, follows new ones while you're at the bottom, keeps your place while you read back, and loads history at the top.

Streamed, growing replies are followed too. Pair it with [Message](./message) and [Bubble](./bubble) for the rows and [Marker](./marker) for day separators and typing indicators.

<Demo title="Basic">
  <MessageScrollerBasic />
  <template #code>

<<< ../demos/MessageScrollerBasic.vue

  </template>
</Demo>

- It is a named log (`label`), so new messages are announced politely. While a reply is streaming in, set `aria-busy` on that message so it's read once when it's done, not word by word.
- The jump button appears when you've scrolled up; `@reach-top` asks for history and `loadHistory(insert)` keeps your place while it's added. Scrolling doesn't animate under reduced motion.

## Usage

```ts
import { BlessMessageScroller } from "blessing-ui";
```

## API

<PropsTable name="BlessMessageScroller" />
