---
title: Type scale
---

<script setup>
import TypeScaleBasic from "../demos/TypeScaleBasic.vue";
</script>

# Type scale

<p class="bless-lead">A specimen of the font sizes, with the size, the line height, and the name</p>

Shows each step of a type scale with a line of text in that size, on a design page. With no steps, it shows the text sizes of this library. For the tokens as a table, see the [tokens guide](../guide/tokens).

<Demo title="Basic">
  <TypeScaleBasic />
  <template #code>

<<< ../demos/TypeScaleBasic.vue

  </template>
</Demo>

- `steps` is a list of steps. Each step has a `name`, a CSS `size`, and an optional `lineHeight` and `weight`. Without it, the steps are the `--bless-text-*` tokens, from the smallest to the largest.
- `sample` is the line of text in each size.
- Each row shows the size and the line height in pixels, as the browser draws them. The sizes of this library use `clamp()`, so the numbers change with the width of the window. They show after the page loads.
- On a narrow screen, the name goes above the sample. A long sample ends with "…".
- The specimen is a region. Change the words with `labels` or a [label pack](../guide/translating): `title`, `size`, and `line`.

## Usage

```ts
import { BlessTypeScale } from "blessing-ui";
```

## API

<PropsTable name="BlessTypeScale" />
