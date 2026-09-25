---
title: RadioGroup
---

<script setup>
import RadioGroupBasic from "../demos/RadioGroupBasic.vue";
</script>

# RadioGroup

<p class="bless-lead">Native radios</p>

One choice out of a few (up to about six) that should all be visible at once. More than that, or when space is short: [Select](./select). A single on/off is a [Switch](./switch) or [Checkbox](./checkbox), not two radios.

<Demo title="Basic">
  <RadioGroupBasic />
  <template #code>

<<< ../demos/RadioGroupBasic.vue

  </template>
</Demo>

- Native radios in a `fieldset`: arrow keys move and select, Tab leaves the group. `label` is the legend.
- Inside a [Field](./form) the field's label names the group (each radio keeps its own), and the field's error reaches it.
- `description` on a radio adds a line under its label; `orientation="horizontal"` for short labels.

## Usage

```ts
import { BlessRadioGroup, BlessRadio } from "blessing-ui";
```

## API

### BlessRadioGroup

<PropsTable name="BlessRadioGroup" />

### BlessRadio

<PropsTable name="BlessRadio" />
