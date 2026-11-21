---
title: Thermostat
---

# Thermostat

<p class="bless-lead">A dial that sets the target temperature and shows the current one</p>

Controls the heating or the air conditioning of a room in a smart home app. The dial is the [knob](./knob), so the arrow keys move it too.

<Demo title="Basic">
  <ThermostatBasic />
  <template #code>

<<< ../demos/ThermostatBasic.vue

  </template>
</Demo>

- `v-model` is the target temperature. `current` is the temperature in the room now.
- `min`, `max`, and `step` limit the target (default 16 to 30, in steps of 0.5). The − and + buttons move it one step.
- `v-model:mode` is `heat`, `cool`, `auto` (default), or `off`. The modes are a group of native radio buttons.
- A status line says what the system does, such as "Cooling to 22.5 °C" or "Holding 22 °C". In heat mode, a room that is too warm only holds. In cool mode, a room that is too cold only holds. Off turns the dial and the buttons off.
- `unit` is `°C` (default) or `°F`, and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `target`, `lower`, `higher`, `stopped`, the four modes, and the functions `now`, `heating`, `cooling`, and `holding`.

## Usage

```ts
import { BlessThermostat } from "blessing-ui";
```

## API

<PropsTable name="BlessThermostat" />

<script setup>
import ThermostatBasic from "../demos/ThermostatBasic.vue";
</script>
