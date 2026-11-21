---
title: Read receipt
---

# Read receipt

<p class="bless-lead">Sent, delivered, and read marks for a message, with who read it</p>

Shows the state of a message that the reader sent. Put it under the [chat bubble](./bubble) of each own message.

<Demo title="Basic">
  <ReadReceiptBasic />
  <template #code>

<<< ../demos/ReadReceiptBasic.vue

  </template>
</Demo>

- `status` is `sending`, `sent`, `delivered`, `read`, or `failed`.
- Sending shows a clock, sent shows one tick, and delivered shows two ticks. Screen readers hear the word for each state.
- Read shows two ticks in the accent color and the word "Read", so the state does not rest on the color. In a group chat, `readBy` lists who read it, such as "Read by Ana, Budi, and Citra".
- Failed shows "Not sent" and a "Try again" button that emits `retry`.
- `time` is the time of the message, as text. The words also show as a tooltip.
- `locale` sets how the names are joined (default English). Change the words with `labels` or a [label pack](../guide/translating): the five states, `retry`, and `readBy` (a function).

## Usage

```ts
import { BlessReadReceipt } from "blessing-ui";
```

## API

<PropsTable name="BlessReadReceipt" />

<script setup>
import ReadReceiptBasic from "../demos/ReadReceiptBasic.vue";
</script>
