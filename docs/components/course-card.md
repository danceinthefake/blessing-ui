---
title: Course card
---

# Course card

<p class="bless-lead">A course with the picture, the teacher, the number of lessons, the level, and the progress</p>

Shows a course in a catalog or in the list of courses that a learner takes. For the lessons inside one course, use the [lesson path](./lesson-path).

<Demo title="Basic">
  <CourseCardBasic />
  <template #code>

<<< ../demos/CourseCardBasic.vue

  </template>
</Demo>

- `title` is the name of the course. If you set `href`, the title is a link and the whole card takes the click.
- `image` is the picture on top. Set `image-alt` only if the picture tells more than the title.
- `teacher`, `lessons`, `duration`, and `level` show as a short line of facts. Each one is optional.
- `progress` is the share that the learner did, from 0 to 100. A bar and a line of text show it. At 100, the card says "Finished". Leave it out before the learner starts.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessCourseCard } from "blessing-ui";
```

## API

<PropsTable name="BlessCourseCard" />

<script setup>
import CourseCardBasic from "../demos/CourseCardBasic.vue";
</script>
