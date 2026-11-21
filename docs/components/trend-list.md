---
title: Trend list
---

# Trend list

<p class="bless-lead">Topics that people talk about now, with the count of posts</p>

Shows what is popular, in the side column of a social app or a news site. For people with scores, use the [leaderboard](./leaderboard).

<Demo title="Basic">
  <TrendListBasic />
  <template #code>

<<< ../demos/TrendListBasic.vue

  </template>
</Demo>

- `trends` is a list in order of rank. Each trend has an `id` and a `topic`. It can also have a `category`, the number of `posts`, and an `href`.
- The list is an ordered list, so screen readers hear the rank. The big number is only for the eye.
- With `href`, the topic is a link. The count shows in short form, such as "15.3K posts", in the `locale`.
- Change the words with `labels` or a [label pack](../guide/translating): `title` and `posts` (a function).

## Usage

```ts
import { BlessTrendList } from "blessing-ui";
```

## API

<PropsTable name="BlessTrendList" />

<script setup>
import TrendListBasic from "../demos/TrendListBasic.vue";
</script>
