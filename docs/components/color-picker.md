---
title: ColorPicker
---

# ColorPicker

<p class="bless-lead">Native color input + swatches</p>

The platform's color picker in a square plate: click the well and the OS dialog opens. The library only frames it. The model is what `<input type="color">` gives: a lowercase `#rrggbb`, no alpha (a platform limit). `showValue` prints the hex beside the well as an `<output>`. `swatches` add one-click presets, drawn by [`BlessColorSwatches`](./color-swatches) as a radio group, so the arrow keys move between them. Pass `{ value, label }` so a screen reader hears a name, such as "Pink", and not a hex code.

Inside a `BlessField` the field's label names the input. `label` is for a picker with no visible label.

<Demo title="Basic">
  <ColorPickerBasic />
  <template #code>

<<< ../demos/ColorPickerBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessColorPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessColorPicker" />

<script setup>
import ColorPickerBasic from "../demos/ColorPickerBasic.vue";
</script>
