---
title: Gradebook
---

<script setup>
import GradebookBasic from "../demos/GradebookBasic.vue";
</script>

# Gradebook

<p class="bless-lead">The scores of each student for each assignment, with averages and missing work</p>

Lets a teacher enter scores and see who needs help. A student sees one row of it in a [data table](./data-table) or a list.

<Demo title="Basic">
  <GradebookBasic />
  <template #code>

<<< ../demos/GradebookBasic.vue

  </template>
</Demo>

- `students` is the list of students, each with an `id` and a `name`. `assignments` is the list of assignments, each with an `id`, a `title`, and an optional `max` score (default 100).
- `v-model` holds the scores by student id and then by assignment id. A score that is not there is missing work.
- The average of a student is the mean of the shares, and missing work counts as zero. If it is under `pass` (default 60%), it gets a mark, the danger color, and the words "below pass" for screen readers.
- The last row gives the class average of each assignment from the scores that are in, and the mean of the student averages.
- With `editable`, each score is a number field with a name such as "Quiz 1 score for Ana". A score over the top is cut to the top. An empty field is missing work.
- The table scrolls sideways on a narrow screen, and the names stay in view.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessGradebook } from "blessing-ui";
```

## API

<PropsTable name="BlessGradebook" />
