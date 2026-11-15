---
title: Color swatches
---

<script setup>
import ColorSwatchesBasic from "../demos/ColorSwatchesBasic.vue";
</script>

# Color swatches

<p class="bless-lead">A set of ready colors, to pick one</p>

Lets a person pick one color from a short set, for example a label color or a cover color. For any color, use the [color picker](./color-picker), which shows these swatches as its presets.

<Demo title="Basic">
  <ColorSwatchesBasic />
  <template #code>

<<< ../demos/ColorSwatchesBasic.vue

  </template>
</Demo>

- `swatches` is a list of CSS colors, or of `{ value, label }`. Give each color a label, so a screen reader says "Pink" and not a hex code. The label is also the tooltip.
- `v-model` is the value of the picked color, or `null`. The match ignores case, so `#E85078` picks `#e85078`.
- The picked color has a ring in the text color. `size` is `md` (default) or `sm`.
- The swatches are a group of native radio buttons: Tab goes into the group, and the arrow keys move between the colors. `disabled` turns all of them off.
- Change the name of the group with `labels` or a [label pack](../guide/translating): `label`.

## Usage

```ts
import { BlessColorSwatches, type BlessColorSwatch } from "blessing-ui";
```

## API

<PropsTable name="BlessColorSwatches" />
