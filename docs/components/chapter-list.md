---
title: Chapter list
---

# Chapter list

<p class="bless-lead">The chapters of an episode, with the current one marked</p>

Shows the parts of a long episode or video, with the start and the length of each part. A click on a chapter plays from its start. For the words of the episode, use the [transcript](./transcript).

<Demo title="Basic">
  <ChapterListBasic />
  <template #code>

<<< ../demos/ChapterListBasic.vue

  </template>
</Demo>

- `chapters` is a list of chapters. Each chapter has a `start` in seconds and a `title`. A chapter lasts until the next one starts.
- `time` is the time of the media now, in seconds. `duration` is the length of the media, and it gives the last chapter its length.
- A click on a chapter emits `seek` with its start. Set the `currentTime` of your media to it.
- The current chapter is bold, with a filled number and a line under it that grows as the chapter plays.
- The list is a navigation landmark, and the current chapter has `aria-current`. Change the words with `labels` or a [label pack](../guide/translating): `title`, and `length` (a function of the minutes).

## Usage

```ts
import { BlessChapterList } from "blessing-ui";
```

## API

<PropsTable name="BlessChapterList" />

<script setup>
import ChapterListBasic from "../demos/ChapterListBasic.vue";
</script>
