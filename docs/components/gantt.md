---
title: Gantt
---

<script setup>
import GanttBasic from "../demos/GanttBasic.vue";
</script>

# Gantt

<p class="bless-lead">Bars on a time axis, draggable, with dependencies</p>

A schedule drawn as bars: what runs when, what overlaps, how far each task has got. For events in order without durations, use [Timeline](./timeline); for tasks that move between states, [Kanban](./kanban).

<Demo title="Basic">
  <GanttBasic />
  <template #code>

<<< ../demos/GanttBasic.vue

  </template>
</Demo>

- `tasks` is `[{ id, label, start, end, progress? }]` with ISO dates (`2026-10-05`). A task covers both its first and last day, so `start` equal to `end` is a one-day bar. `progress` (0 to 100) fills the bar with ink.
- The axis spans the tasks, and today if it is earlier; `from` and `to` fix it, and tasks outside are clipped. `dayWidth` is the zoom: below 12 px the day numbers are left out and only months show. Weekends are shaded and today has an accent line.
- The label column stays put while the chart scrolls sideways. `locale` sets the month and date names.
- Each bar is a button with its dates and progress as its name ("Build: Oct 4 to Oct 10, 60% done"). One tab stop; **↑ ↓** move between bars, **Home** and **End** jump, **Enter** or a click selects. `v-model:selected` holds the chosen id (the accent marks it) and `select` fires with the task.
- `after: [id, …]` on a task draws an elbow arrow from the end of each task it waits for to its start, and the bar's name says it ("Build: Oct 4 to Oct 10, after Design"). Unknown ids are ignored. The arrows follow a bar while it is dragged.
- `editable` makes it a planner. Drag a bar to **move** it, or its left or right edge to **resize** it, in whole days; the bar follows the pointer and the change is committed when you let go. An end cannot cross the other, so a task is always at least one day. From the keyboard, **Alt + ← →** moves the focused task a day and **Alt + Shift + ← →** moves its end; each change is announced ("Build: Oct 5 to Oct 11").
- `v-model:tasks` carries the edits (new objects, dates as ISO strings), and `change(task, { start, end })` fires per edit, so you can save it. Without `editable` nothing can be changed and the grips are not drawn.
- Moving a task past the edge of the chart widens the axis when `from` and `to` are not fixed; with them fixed, the bar is clipped.

## Usage

```ts
import { BlessGantt } from "blessing-ui";
```

## API

<PropsTable name="BlessGantt" />
