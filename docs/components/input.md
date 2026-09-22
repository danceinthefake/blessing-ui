---
title: Input
---

<script setup>
import InputBasic from "../demos/InputBasic.vue";
import InputSizes from "../demos/InputSizes.vue";
import InputStates from "../demos/InputStates.vue";
</script>

# Input

<p class="bless-lead">Text-like input</p>

One line of text. Multi-line is [Textarea](./textarea); a number with step and format is [InputNumber](./input-number); a fixed pattern is [InputMask](./input-mask); a secret is [PasswordInput](./password-input); a list of values is [InputTags](./input-tags).

<Demo title="Basic">
  <InputBasic />
  <template #code>

<<< ../demos/InputBasic.vue

  </template>
</Demo>

<Demo title="Sizes">
  <InputSizes />
  <template #code>

<<< ../demos/InputSizes.vue

  </template>
</Demo>

<Demo title="States">
  <InputStates />
  <template #code>

<<< ../demos/InputStates.vue

  </template>
</Demo>

- In a form, wrap it in a [Field](./form): that gives the label, description and error, and wires them. Input's own `description` and `error` are for a label-less input — a search box, an inline edit with `aria-label`.
- `#prefix` / `#suffix` sit inside the plate (a unit, a shortcut hint). Things beside it — a button, `https://` — are [InputGroup](./input-group).
- `type` passes through: `email`, `url`, `search`, `tel` get the right keyboard on phones. `type="number"` works, but InputNumber has the stepper and locale formatting.

## Usage

```ts
import { BlessInput } from "blessing-ui";
```

## API

<PropsTable name="BlessInput" />
