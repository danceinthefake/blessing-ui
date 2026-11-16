---
title: Task list
---

<script setup>
import TaskListBasic from "../demos/TaskListBasic.vue";
</script>

# Task list

<p class="bless-lead">Tasks with check boxes, an assignee, a due date, and subtasks</p>

Keeps the to-do list of a team, for example the work on one episode. Open tasks stay at the top, and done tasks go to the bottom. For steps that a new user must do once, use the [onboarding checklist](./onboarding-checklist).

<Demo title="Basic">
  <TaskListBasic />
  <template #code>

<<< ../demos/TaskListBasic.vue

  </template>
</Demo>

- `v-model` is the list of tasks. Each task has an `id` and a `title`. It can also have `done`, `subtasks`, and a `due` date as `YYYY-MM-DD`. An `assignee` has a `name` and an `avatar`.
- Each task and each subtask has a native check box. A done task is gray and struck through, and it goes to the bottom of the list.
- A task with subtasks shows how many are done, such as "1 of 3".
- If the due date of an open task is before today, the date turns red and says "late". `today` sets today. Without it, the list uses today of the reader, after the page loads.
- With `addable` (on by default), a field shows at the bottom. If the reader types a title and presses Enter, the field adds the task.
- `locale` sets the format of the dates (default English). Change the words with `labels` or a [label pack](../guide/translating): `title`, `add`, `late`, and the functions `due` and `subtasks`.

## Usage

```ts
import { BlessTaskList } from "blessing-ui";
```

## API

<PropsTable name="BlessTaskList" />
