---
title: Variant picker
---

<script setup>
import VariantPickerBasic from "../demos/VariantPickerBasic.vue";
</script>

# Variant picker

<p class="bless-lead">The options of a product, with sold-out values crossed out</p>

Lets a person choose the size, the color, and other options of a product. A color shows as a swatch, and other values show as buttons. For colors with no product, use the [color swatches](./color-swatches).

<Demo title="Basic">
  <VariantPickerBasic />
  <template #code>

<<< ../demos/VariantPickerBasic.vue

  </template>
</Demo>

- `options` is a list of options. Each option has a `key`, a `name`, and a list of `values`. Each value has a `value` and a `label`. A value with a `color` shows as a swatch, and a value with `soldOut` is crossed out and cannot be chosen.
- `v-model` is an object with the chosen value of each option by key, such as `{ color: "black", size: "m" }`. A pick changes one key and keeps the others.
- The name of the chosen value shows after the name of the option. The chosen value has a thick frame in the text color, so it shows on any swatch.
- Each option is a group of native radio buttons, so the arrow keys move in the group. A swatch has its name for screen readers and as a tooltip. A sold-out value says "sold out". Change the words with `labels` or a [label pack](../guide/translating): `soldOut`.

## Usage

```ts
import { BlessVariantPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessVariantPicker" />
