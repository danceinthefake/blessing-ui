---
title: Scheduler
---

<script setup>
import SchedulerBasic from "../demos/SchedulerBasic.vue";
</script>

# Scheduler

<p class="bless-lead">A day or week of time you can drag events into</p>

A calendar of hours for the things that take time — meetings, shifts, appointments, lessons. Drag across empty time to make an event, drag an event to move it, pull its foot to change its length. For days with no times use [Calendar](./calendar); for work over weeks, [Gantt](./gantt).

<Demo title="A week">
  <SchedulerBasic />
  <template #code>

<<< ../demos/SchedulerBasic.vue

  </template>
</Demo>

- `v-model` is the events: `{ id, title, date: "YYYY-MM-DD", start, end }` with `start` and `end` in **minutes after midnight** (540 = 09:00). No time zones: it is a local wall-clock day. `v-model:date` is any day in the period shown; `view="day"` shows one day, `"week"` seven.
- **Pointer** (mouse and pen): drag over empty time to create an event (a flick is ignored), drag an event to move it in time and to another day, drag its foot to resize; everything snaps to `snap` minutes (15). Events that overlap sit side by side. **Touch**: events drag the same way, but empty time scrolls the page, so use **Add event** to create.
- **Keyboard**: events are focusable (one tab stop); **↑ ↓** move by the snap, **← →** to the next or previous day (focus follows), **Alt+↑ ↓** change the length, **Enter** goes to the title field, **Delete** removes. Each change is announced with the day and times.
- The panel under the grid edits the selected event's title and removes it. `create`, `change` and `remove` events carry the event. `dayStart` / `dayEnd` set the hours shown, `hourHeight` the scale, `:editable="false"` makes it read-only, and `labels` translates the wording.

## Usage

```ts
import { BlessScheduler } from "blessing-ui";
```

## API

<PropsTable name="BlessScheduler" />
