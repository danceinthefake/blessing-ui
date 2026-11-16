---
title: Battery level
---

<script setup>
import BatteryLevelBasic from "../demos/BatteryLevelBasic.vue";
</script>

# Battery level

<p class="bless-lead">The charge of a battery, with charging and low states</p>

Shows the battery of a device, a sensor, or a phone. Put it on a [device tile](./device-tile) or in a list of devices.

<Demo title="Basic">
  <BatteryLevelBasic />
  <template #code>

<<< ../demos/BatteryLevelBasic.vue

  </template>
</Demo>

- `level` is the charge from 0 to 100. The percent shows next to the battery shape.
- `charging` adds a bolt and the word "Charging".
- At or below `low` (default 20), and not on charge, the battery is red and says "Low".
- The battery is a meter. Screen readers hear its name, such as "Battery, Door sensor", and the value with the states, such as "14%, Low". `label` gives the device.
- Change the words with `labels` or a [label pack](../guide/translating): `battery`, `charging`, and `low`.

## Usage

```ts
import { BlessBatteryLevel } from "blessing-ui";
```

## API

<PropsTable name="BlessBatteryLevel" />
