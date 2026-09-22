---
title: Checkbox
---

<script setup>
import CheckboxArray from "../demos/CheckboxArray.vue";
import CheckboxBasic from "../demos/CheckboxBasic.vue";
</script>

# Checkbox

<p class="bless-lead">Native checkbox</p>

A real `<input type="checkbox">` under a cut plate with a drawn tick, wrapped in its label so the whole row is the hit target. `v-model` is a boolean, or — with `value` on each box — an array of the checked values. `description` adds a second line and wires `aria-describedby`; `indeterminate` shows the dash for "some of these" (a parent of a group; it's a display state — clicking sets it checked). A box with no visible text needs an `aria-label`, which passes through to the input.

For a message on an invalid box, put it in a [Field](./form); for a set of exclusive choices, [RadioGroup](./radio-group); for an on/off _setting_ that takes effect at once rather than a choice submitted with a form, [Switch](./switch).

<Demo title="Array">
  <CheckboxArray />
  <template #code>

<<< ../demos/CheckboxArray.vue

  </template>
</Demo>

<Demo title="Basic">
  <CheckboxBasic />
  <template #code>

<<< ../demos/CheckboxBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessCheckbox } from "blessing-ui";
```

## API

<PropsTable name="BlessCheckbox" />
