---
title: Message
---

<script setup>
import MessageBasic from "../demos/MessageBasic.vue";
</script>

# Message

<p class="bless-lead">Avatar + header + content + footer row</p>

A message with its sender around it — avatar, name, time — holding one or more [Bubble](./bubble)s. Each is an `article`, so screen-reader users can jump between messages.

<Demo title="Basic">
  <MessageBasic />
  <template #code>

<<< ../demos/MessageBasic.vue

  </template>
</Demo>

- `align="end"` for the viewer's own; `compact` drops the avatar and header for consecutive messages from the same sender.
- `time` is shown as written; add `datetime` so the `<time>` element carries the real timestamp.

## Usage

```ts
import { BlessMessage } from "blessing-ui";
```

## API

<PropsTable name="BlessMessage" />
