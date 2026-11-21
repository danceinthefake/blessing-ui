---
title: Activity feed
---

# Activity feed

<p class="bless-lead">What people did, in groups by day</p>

Shows the recent events of a team or a project: who did what, and when. The newest event is at the top, and the events are in groups by day. For notices that a person must read, use the [notification inbox](./notification-inbox). For steps in a fixed order, use the [timeline](./timeline).

<Demo title="Basic">
  <ActivityFeedBasic />
  <template #code>

<<< ../demos/ActivityFeedBasic.vue

  </template>
</Demo>

- `events` is a list of events. Each event has an `id`, an `actor`, an `action`, and a `time`. The actor has a `name` and an optional `avatar`. An optional `target` names the thing, and an optional `href` makes it a link.
- The feed puts the events in order, newest first, and in groups by day: "Today", "Yesterday", then the date. Each event shows its time as a [relative time](./relative-time), such as "2 hr. ago".
- The `event` slot replaces the text of an event. It gets `{ event }`.
- `locale` sets the language of the day names and the times (default English). `now` sets a fixed "now", for example in a test or an example.
- The server does not know the day of the reader. So, until the page loads, the groups show plain dates in UTC. Then they change to "Today" and "Yesterday" in the zone of the reader.
- Each day is a section named by its date, with a list of events.

## Usage

```ts
import { BlessActivityFeed } from "blessing-ui";
```

## API

<PropsTable name="BlessActivityFeed" />

<script setup>
import ActivityFeedBasic from "../demos/ActivityFeedBasic.vue";
</script>
