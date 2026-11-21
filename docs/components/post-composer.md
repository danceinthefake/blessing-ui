---
title: Post composer
---

# Post composer

<p class="bless-lead">Write a post with images, a poll, and a count of the characters left</p>

The box at the top of a social feed or a community page. To show posts, use the [activity feed](./activity-feed) or the [thread](./thread).

<Demo title="Basic">
  <PostComposerBasic />
  <template #code>

<<< ../demos/PostComposerBasic.vue

  </template>
</Demo>

- `v-model` is the text of the post. `max` is the most characters (default 280).
- The count under the box says how many characters are left. An emoji counts as one character, as people see it. Near the limit, the count is bold. Over the limit, the box is not valid and the count says how many characters are too many.
- The image button adds pictures with a preview, up to `maxImages` (default 4). The ✕ on a preview removes it.
- The poll button adds two choice fields, and "Add a choice" grows the poll to four. A poll needs at least two choices.
- "Post" emits `post` with the text, the image files, and the poll choices. It is off for an empty post, a post over the limit, or a poll with fewer than two choices.
- `author` shows the avatar of the writer.
- Change the words with `labels` or a [label pack](../guide/translating): `placeholder`, `image`, `poll`, `addChoice`, `post`, and the functions `left`, `over`, `choice`, and `removeImage`.

## Usage

```ts
import { BlessPostComposer } from "blessing-ui";
```

## API

<PropsTable name="BlessPostComposer" />

<script setup>
import PostComposerBasic from "../demos/PostComposerBasic.vue";
</script>
