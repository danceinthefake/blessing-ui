---
title: MessageScroller
---

<script setup>
import MessageScrollerBasic from "../demos/MessageScrollerBasic.vue";
</script>

# MessageScroller

<p class="bless-lead">Chat viewport</p>

## When to use

The viewport for a chat or activity feed. It follows new messages while you're at the bottom (including streamed, growing ones), stops following the moment you scroll up and offers a "↓ Latest" button instead, and loads older history without the list jumping when you reach the top. Pair it with `BlessMessage` and `BlessBubble` for the rows and `BlessMarker` for day separators and typing indicators.

<Demo title="Basic">
  <MessageScrollerBasic />
  <template #code>

<<< ../demos/MessageScrollerBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessMessageScroller } from "blessing-ui";
```

## API

<PropsTable name="BlessMessageScroller" />
