---
title: Assignment
---

# Assignment

<p class="bless-lead">An assignment with the instructions, the due date, a submission, and the grade</p>

Shows a learner what to do, takes their work, and later gives the grade and the feedback.

<Demo title="Basic">
  <AssignmentBasic />
  <template #code>

<<< ../demos/AssignmentBasic.vue

  </template>
</Demo>

- `title`, `due`, `points`, and `instructions` describe the work. Line breaks in the instructions stay.
- Before the learner hands in, a [file input](./file-input) takes the files in `v-model`. `accept` limits the file types. Hand in emits `submit` with the files.
- `submitted` is the time of the hand-in as text. Then the files show as a list. `late` marks a late hand-in.
- `grade` and `feedback` show in a box when the work is graded.
- A tag on top says the state in words: To do, Handed in, Handed in late, or Graded.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessAssignment } from "blessing-ui";
```

## API

<PropsTable name="BlessAssignment" />

<script setup>
import AssignmentBasic from "../demos/AssignmentBasic.vue";
</script>
