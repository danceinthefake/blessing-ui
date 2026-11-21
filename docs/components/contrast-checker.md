---
title: Contrast checker
---

# Contrast checker

<p class="bless-lead">Two colors in, the contrast ratio and the WCAG levels out</p>

Tells a designer if a text color is easy to read on a background. It shows the ratio and which WCAG 2.1 levels pass. For the shades of a whole palette, use the [palette viewer](./palette-viewer).

<Demo title="Basic">
  <ContrastCheckerBasic />
  <template #code>

<<< ../demos/ContrastCheckerBasic.vue

  </template>
</Demo>

- `v-model:text` and `v-model:background` are the two colors, as hex. Each color has a native color input and a text field.
- The ratio uses the relative luminance of WCAG 2.1, from 1:1 to 21:1. It is cut, not rounded, to two decimals, so a color that only just fails does not show as a pass.
- The list shows the levels: AA needs 4.5:1 for normal text and 3:1 for large text, and AAA needs 7:1 and 4.5:1. Parts of the interface, such as the edge of a field, need 3:1.
- Each level shows a mark and the word "Pass" or "Fail", so the result does not rest on the color. The ratio is a status line, so screen readers hear a change. The swap button changes the two colors over.
- The functions behind it, `contrastRatio` and `wcagLevels`, come with the library.
- Change the words with `labels` or a [label pack](../guide/translating): `text`, `background`, `swap`, `ratio`, `sample`, `pass`, `fail`, `invalid`, `aaText`, `aaLarge`, `aaaText`, `aaaLarge`, and `ui`.

## Usage

```ts
import { BlessContrastChecker, contrastRatio } from "blessing-ui";
```

## API

<PropsTable name="BlessContrastChecker" />

<script setup>
import ContrastCheckerBasic from "../demos/ContrastCheckerBasic.vue";
</script>
