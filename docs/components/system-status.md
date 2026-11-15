---
title: System status
---

<script setup>
import SystemStatusBasic from "../demos/SystemStatusBasic.vue";
</script>

# System status

<p class="bless-lead">The parts of a service with their state, and one line for the whole</p>

Shows on a status page if each part of a service works. The line at the top sums up the whole service. For the story of one problem, use the [incident timeline](./incident-timeline). For the history of a part, use the [uptime bar](./uptime-bar).

<Demo title="Basic">
  <SystemStatusBasic />
  <template #code>

<<< ../demos/SystemStatusBasic.vue

  </template>
</Demo>

- `parts` is a list of parts. Each part has a `name`, a `status`, and an optional `description`. The status is `operational`, `maintenance`, `degraded`, `partial`, or `major`.
- The whole service takes the worst state of its parts. If all parts work, the line says "All systems are working".
- Each state has its own mark and word: a check for working, a tool for maintenance, a dash for slow, a "!" for a partial outage, and a cross for a major outage.
- `updated` is the time of the last check, as text.
- The line at the top is a status line, so screen readers hear a change. Change the words with `labels` or a [label pack](../guide/translating): `title`, `operational`, `maintenance`, `degraded`, `partial`, `major`, `all`, and the functions `summary` and `updated`.

## Usage

```ts
import { BlessSystemStatus } from "blessing-ui";
```

## API

<PropsTable name="BlessSystemStatus" />
