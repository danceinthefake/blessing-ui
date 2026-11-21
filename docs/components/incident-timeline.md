---
title: Incident timeline
---

# Incident timeline

<p class="bless-lead">The updates of an incident, with times, states, and the affected parts</p>

Tells users what went wrong and what the team does about it, on a status page. The newest update is at the top. For the state of each part now, use the [system status](./system-status).

<Demo title="Basic">
  <IncidentTimelineBasic />
  <template #code>

<<< ../demos/IncidentTimelineBasic.vue

  </template>
</Demo>

- `title` names the incident, as a heading. `impact` is `minor` (default), `major`, or `critical`. `affected` lists the parts of the service.
- `updates` is a list of updates, newest first. Each update has a `status`, a `time` as text, and a `text`. The status is `investigating`, `identified`, `monitoring`, or `resolved`.
- The state of the incident is the state of the newest update. The edge of the card is the warning color for a minor incident and the danger color for a major one. It changes to the success color at "Resolved". The impact and the state also show as words.
- Change the words with `labels` or a [label pack](../guide/translating): `investigating`, `identified`, `monitoring`, `resolved`, `minor`, `major`, `critical`, `affected`, and `impact`.

## Usage

```ts
import { BlessIncidentTimeline } from "blessing-ui";
```

## API

<PropsTable name="BlessIncidentTimeline" />

<script setup>
import IncidentTimelineBasic from "../demos/IncidentTimelineBasic.vue";
</script>
