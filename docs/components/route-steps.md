---
title: Route steps
---

<script setup>
import RouteStepsBasic from "../demos/RouteStepsBasic.vue";
</script>

# Route steps

<p class="bless-lead">The turns of a route with a direction, the distance, and the time</p>

Lists the directions from one place to another, next to a [map with pins](./map-pins) or alone. The steps come from your routing service.

<Demo title="Basic">
  <RouteStepsBasic />
  <template #code>

<<< ../demos/RouteStepsBasic.vue

  </template>
</Demo>

- `steps` is the list of steps. Each step has a `turn`, a `text`, and optional `distance` in meters and `duration` in seconds.
- The turn picks the arrow: `start`, `straight`, `slight-left`, `left`, `sharp-left`, `slight-right`, `right`, `sharp-right`, `u-turn`, `roundabout`, or `arrive`. The text says the turn in words, so the arrow is only a help.
- The top line gives the total distance and time.
- Distances under 1 km show in meters, rounded to 10 m. Longer distances show in kilometers.
- `current` marks the step that the traveler is on now, with a frame and `aria-current`. The steps before it are dimmer.
- `locale` formats the units. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessRouteSteps } from "blessing-ui";
```

## API

<PropsTable name="BlessRouteSteps" />
