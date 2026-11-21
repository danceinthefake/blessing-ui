---
title: Forum topics
---

# Forum topics

<p class="bless-lead">Topics of a forum with replies, views, the last post, and pinned topics</p>

The list page of a forum or a community board. To show one topic with its replies, use the [thread](./thread).

<Demo title="Basic">
  <ForumTopicsBasic />
  <template #code>

<<< ../demos/ForumTopicsBasic.vue

  </template>
</Demo>

- `topics` is a list of topics. Each topic has an `id`, a `title`, an `author`, and the number of `replies`. It can also have an `href`, `views`, and `tags`. `last` is the last post, with its author and time. `pinned`, `locked`, and `solved` mark the state.
- Pinned topics come first and have a light tint. The rest keep their order.
- Pinned, solved, and locked each show as a mark and a word, such as "✓ Solved". Screen readers hear only the word.
- The counts show in short form, such as "1.5K replies", in the `locale`.
- On a narrow screen, the counts go under the title.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `pinned`, `locked`, `solved`, and the functions `by`, `replies`, `views`, and `last`.

## Usage

```ts
import { BlessForumTopics } from "blessing-ui";
```

## API

<PropsTable name="BlessForumTopics" />

<script setup>
import ForumTopicsBasic from "../demos/ForumTopicsBasic.vue";
</script>
