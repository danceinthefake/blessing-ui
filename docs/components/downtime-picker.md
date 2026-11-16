---
title: Downtime picker
---

<script setup>
import DowntimePickerBasic from "../demos/DowntimePickerBasic.vue";
</script>

# Downtime picker

<p class="bless-lead">The reason for a stop, with big touch buttons</p>

Asks the operator why a machine stopped, on the tablet at the station. Downtime is the time a machine does not run. The reasons feed the [OEE gauge](./oee-gauge) and the reports of the line.

<Demo title="Basic">
  <DowntimePickerBasic />
  <template #code>

<<< ../demos/DowntimePickerBasic.vue

  </template>
</Demo>

- `reasons` is a list. Each reason has an `id`, a `label`, an optional `icon`, and `planned`.
- Unplanned stops, such as a jam, come first. Planned stops, such as a break, come under them, in dashed tiles.
- The tiles are big, for gloves. Each tile is a native radio button, so the arrow keys move inside a group and screen readers hear the choice.
- `v-model` is the id of the chosen reason. The chosen tile is filled.
- `machine` names the machine in the question, such as "Why did Press 2 stop?".
- "Save the reason" emits `save` with the reason and the note. It is off until a reason is chosen.
- Change the words with `labels` or a [label pack](../guide/translating): `unplanned`, `planned`, `note`, `save`, and `title` (a function).

## Usage

```ts
import { BlessDowntimePicker } from "blessing-ui";
```

## API

<PropsTable name="BlessDowntimePicker" />
