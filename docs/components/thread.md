---
title: Thread
---

<script setup>
import ThreadBasic from "../demos/ThreadBasic.vue";
</script>

# Thread

<p class="bless-lead">Nested comment thread</p>

Comments with replies, and replies to those replies, as under an issue, a document, or a post. Each comment is a [Message](./message). For a chat that runs in one line, use Message and [MessageScroller](./message-scroller).

<Demo title="Basic">
  <ThreadBasic />
  <template #code>

<<< ../demos/ThreadBasic.vue

  </template>
</Demo>

- `comments` is a list of `{ id, name, avatar, time, datetime, body, replies }`. `replies` has the same shape, to any depth.
- The replies of a comment are in a native `<details>`. Its summary counts all the replies below, for example "3 replies". A click or Enter folds them. `collapsed: true` on a comment starts its replies folded.
- A line under the avatar joins the replies to their parent. Below `maxDepth` (default 3), the replies stop indenting, so a long chain stays readable on a phone.
- `body` is plain text. For links, mentions, or code, use the default slot. The slots `default`, `footer`, and `actions` get `{ comment, depth }` on every level. Put the Reply button in `footer`.
- The thread is a nested ordered list, so a screen reader announces the number of comments on each level.
- Change the words with `labels.replies` or a [label pack](../guide/translating).

## Usage

```ts
import { BlessThread } from "blessing-ui";
```

## API

<PropsTable name="BlessThread" />
