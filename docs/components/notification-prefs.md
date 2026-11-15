---
title: Notification preferences
---

<script setup>
import NotificationPrefsBasic from "../demos/NotificationPrefsBasic.vue";
</script>

# Notification preferences

<p class="bless-lead">A grid of events by channel, with a check box in each cell</p>

Lets a person choose which events reach them, and by which channel, such as email or push. A box at the top of each column turns that channel on or off for all events. For a list of notices that came in, use the [notification inbox](./notification-inbox).

<Demo title="Basic">
  <NotificationPrefsBasic />
  <template #code>

<<< ../demos/NotificationPrefsBasic.vue

  </template>
</Demo>

- `events` is a list of rows, each with a `key`, a `label`, and an optional `description`. `channels` is a list of columns, each with a `key` and a `label`.
- `v-model` holds the channels that are on for each event, such as `{ reply: ["push"] }`.
- The box at the top of a column is on if every event uses that channel, and off if none does. Between the two, it shows a dash.
- The grid is a table of native check boxes, so the keyboard and screen readers know it. Each box has a name, such as "Reply to you by Push".
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `event`, and the functions `all` and `cell`.

## Usage

```ts
import { BlessNotificationPrefs } from "blessing-ui";
```

## API

<PropsTable name="BlessNotificationPrefs" />
