---
title: ColorPicker
---

<script setup>
import ColorPickerBasic from "../demos/ColorPickerBasic.vue";
</script>

# ColorPicker

<p class="bless-lead">Native colour input + swatches</p>

The platform's colour picker in a square plate: click the well and the OS dialog opens; the library only frames it. The model is what `<input type="color">` gives — a lowercase `#rrggbb`, no alpha (a platform limit). `showValue` prints the hex beside the well as an `<output>`; `swatches` add one-click presets with a pressed state — pass `{ value, label }` so a screen reader hears "Megumi" rather than a hex.

Inside a `BlessField` the field's label names the input; `label` is for a picker with no visible label.

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
