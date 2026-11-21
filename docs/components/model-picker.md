---
title: Model picker
---

# Model picker

<p class="bless-lead">A select for a model, with a note, marks, and tags</p>

Lets a person choose the model that answers, next to the [prompt input](./prompt-input). Each model shows a short note, how fast it is, and how much it costs. For a plain list of choices, use the [select](./select).

<Demo title="Basic">
  <ModelPickerBasic />
  <template #code>

<<< ../demos/ModelPickerBasic.vue

  </template>
</Demo>

- `models` is a list of models. Each model has an `id` and a `name`. It can also have a `description`, a `speed` and a `cost` from 1 to 3, `tags`, and `disabled`.
- `v-model` is the id of the chosen model. With no model, the button says "Choose a model".
- A click on the button opens a [listbox](./listbox) in a popover. The keyboard works as in the listbox: arrow keys move, and Enter or Space chooses. A choice closes the popover.
- Speed and cost show as three dots. Screen readers hear them in words, such as "speed 2 of 3".
- Change the words with `labels` or a [label pack](../guide/translating): `label`, `choose`, and `speed` and `cost` (functions of the level).

## Usage

```ts
import { BlessModelPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessModelPicker" />

<script setup>
import ModelPickerBasic from "../demos/ModelPickerBasic.vue";
</script>
