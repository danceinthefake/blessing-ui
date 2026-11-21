---
title: Chat history
---

# Chat history

<p class="bless-lead">Past chats in groups by age, with search, rename, and delete</p>

Shows the past chats with an assistant, for a sidebar. The newest chat is at the top, and the chats are in groups: today, yesterday, the last 7 days, the last 30 days, and older. For a list of links of a site, use the [sidebar navigation](./sidebar-nav).

<Demo title="Basic">
  <ChatHistoryBasic />
  <template #code>

<<< ../demos/ChatHistoryBasic.vue

  </template>
</Demo>

- `chats` is a list of chats. Each chat has an `id`, a `title`, and the `time` of its last message.
- `v-model:selected` is the id of the open chat. It has a bar at its start and bold words. A click on a chat sets it and emits `select`.
- The search box filters the chats by title. `:search="false"` hides it.
- The rename button changes the title to a field. Enter or a click outside emits `rename` with the id and the new title, and Escape cancels. The delete button emits `remove` with the id. If these events come in, change your list.
- The rename and delete buttons show on hover and on focus. On a touch screen, they show all the time.
- The server does not know the day of the reader, so the groups show after the page loads. `now` sets a fixed "now", for example in a test.
- The list is a navigation landmark. Change the words with `labels` or a [label pack](../guide/translating): `title`, `search`, `none`, `today`, `yesterday`, `week`, `month`, `older`, `rename`, and `remove`.

## Usage

```ts
import { BlessChatHistory } from "blessing-ui";
```

## API

<PropsTable name="BlessChatHistory" />

<script setup>
import ChatHistoryBasic from "../demos/ChatHistoryBasic.vue";
</script>
