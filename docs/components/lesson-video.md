---
title: Lesson video
---

# Lesson video

<p class="bless-lead">A lesson video with notes at points in time that take you back to that point</p>

Lets a learner watch a lesson and keep notes that link to the right moment. For a video alone, use the [video](./video).

<Demo title="Basic">
  <LessonVideoBasic />
  <template #code>

<<< ../demos/LessonVideoBasic.vue

  </template>
</Demo>

- `src`, `title`, and `poster` set the video. It uses the controls of the browser.
- `captions` is a WebVTT file with the captions, and `captions-lang` is its language. Give captions, so people who cannot hear the lesson can follow it.
- `v-model` is the list of notes. Each note has an `id`, the point `at` in seconds, and a `text`.
- The button under the note box shows the time now, as in "Add a note at 1:23". The notes sort by time.
- The time of a note is a button. It moves the video to that point and puts the focus on the video.
- On a narrow screen, the notes go below the video.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessLessonVideo } from "blessing-ui";
```

## API

<PropsTable name="BlessLessonVideo" />

<script setup>
import LessonVideoBasic from "../demos/LessonVideoBasic.vue";
</script>
