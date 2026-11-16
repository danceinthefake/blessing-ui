---
title: Device tile
---

<script setup>
import DeviceTileBasic from "../demos/DeviceTileBasic.vue";
</script>

# Device tile

<p class="bless-lead">A device with its state, a switch, and the main reading</p>

Shows one device in a smart home app. Put many tiles in a grid for a room. For a group of devices that change together, use the [scene buttons](./scene-buttons).

<Demo title="Basic">
  <DeviceTileBasic />
  <template #code>

<<< ../demos/DeviceTileBasic.vue

  </template>
</Demo>

- `name` is the name of the device. `room`, `icon`, and `reading` are optional. The reading is text, such as "22 °C" or "Closed".
- If the device is on, `v-model` is true. The [switch](./switch) is named with the device, such as "Power, Desk lamp".
- A device that is on has a thick top edge in the accent color and the word "On".
- `offline` turns the switch off and shows "Offline" with a dashed edge.
- `sensor` is for a device that only reads, such as a door sensor. It has no switch.
- Change the words with `labels` or a [label pack](../guide/translating): `on`, `off`, `offline`, and `power` (a function).

## Usage

```ts
import { BlessDeviceTile } from "blessing-ui";
```

## API

<PropsTable name="BlessDeviceTile" />
