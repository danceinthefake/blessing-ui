---
title: Conversation list
---

<script setup>
import ConversationListBasic from "../demos/ConversationListBasic.vue";
</script>

# Conversation list

<p class="bless-lead">Conversations with the last message, the time, and the unread count</p>

The side column of a chat or messages app. Put the [message scroller](./message-scroller) of the open conversation next to it.

<Demo title="Basic">
  <ConversationListBasic />
  <template #code>

<<< ../demos/ConversationListBasic.vue

  </template>
</Demo>

- `conversations` is a list. Each conversation has an `id`, a `name`, the `last` message, and the `time` as text. It can also have an `avatar`, an `unread` count, `online`, and `typing`.
- A conversation with unread messages is bold and has a count, such as "2". Screen readers hear "2 unread messages". A count above 99 shows as "99+".
- `online` adds a green dot to the avatar. Screen readers hear "online" after the name.
- `typing` shows "typing…" in place of the last message.
- `v-model` is the id of the open conversation. It has a bar in the accent color and `aria-current`.
- The list is a navigation region. Change the words with `labels` or a [label pack](../guide/translating): `title`, `typing`, `online`, and `unread` (a function).

## Usage

```ts
import { BlessConversationList } from "blessing-ui";
```

## API

<PropsTable name="BlessConversationList" />
