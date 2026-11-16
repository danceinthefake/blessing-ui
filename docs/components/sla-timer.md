---
title: SLA timer
---

<script setup>
import SlaTimerBasic from "../demos/SlaTimerBasic.vue";
</script>

# SLA timer

<p class="bless-lead">The time left to answer or to solve a ticket, with a warning and a breach state</p>

An SLA (service level agreement) is a promise about time, such as "we reply within 4 hours". The timer shows how much of that time is left. Put it next to a [ticket view](./ticket-view).

<Demo title="Basic">
  <SlaTimerBasic />
  <template #code>

<<< ../demos/SlaTimerBasic.vue

  </template>
</Demo>

- `label` names the promise, such as "First reply". `due` is the deadline as an ISO date and time.
- `window` is the whole time in minutes (default 480). The bar shows the part that is left.
- Under `warn` minutes (default 60), the timer says "At risk" and the bar is striped. After the deadline, it says "Overdue by …" in red.
- If the work is done in time, set `met`. The timer stops and shows "Met".
- `now` is the time now, as an ISO date and time. Without it, the timer uses the clock of the reader after the page loads, and it updates each half minute.
- Each state has a mark and words, so it does not rest on the color.
- Change the words with `labels` or a [label pack](../guide/translating): `met`, `atRisk`, and the functions `left`, `over`, and `time`.

The `minutesLeft` function gives the minutes to a deadline. It is exported for your own views.

## Usage

```ts
import { BlessSlaTimer } from "blessing-ui";
```

## API

<PropsTable name="BlessSlaTimer" />
