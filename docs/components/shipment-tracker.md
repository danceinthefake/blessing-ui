---
title: Shipment tracker
---

<script setup>
import ShipmentTrackerBasic from "../demos/ShipmentTrackerBasic.vue";
</script>

# Shipment tracker

<p class="bless-lead">The steps of a delivery, with dates and the latest update</p>

Shows where an order is: ordered, packed, shipped, out for delivery, or delivered. Under the steps, it shows the latest update of the carrier. For the steps of a form, use the [steps](./steps).

<Demo title="Basic">
  <ShipmentTrackerBasic />
  <template #code>

<<< ../demos/ShipmentTrackerBasic.vue

  </template>
</Demo>

- `stage` is the last step that the order reached: 0 ordered, 1 packed, 2 shipped, 3 out for delivery, and 4 delivered. The steps before it have a check, and a line fills up to it.
- `dates` gives the date of each step that is done, as text, in the same order.
- `events` is the list of updates of the carrier, newest first. Each update has a `time` and a `text`, both as text, and an optional `place`. The newest update shows under the steps. "All updates" opens the full list.
- `problem` shows a problem with the delivery as an alert. The current step then shows a "!" in the danger color.
- `tracking` shows the tracking number, with the `carrier` name. With a `tracking-url`, the number is a link.
- The current step has `aria-current="step"`, and screen readers hear "done" or "current step" after each name. Change the words with `labels` or a [label pack](../guide/translating): `title`, `ordered`, `packed`, `shipped`, `out`, `delivered`, `latest`, `history`, `tracking`, `done`, and `current`.

## Usage

```ts
import { BlessShipmentTracker } from "blessing-ui";
```

## API

<PropsTable name="BlessShipmentTracker" />
