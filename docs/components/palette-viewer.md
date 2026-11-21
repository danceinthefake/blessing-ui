---
title: Palette viewer
---

# Palette viewer

<p class="bless-lead">The shades of each color, with the value, a copy button, and the contrast</p>

Shows a palette on a design page, so a designer can see each shade, copy its value, and know if it reads well on white or black. For two colors only, use the [contrast checker](./contrast-checker).

<Demo title="Basic">
  <PaletteViewerBasic />
  <template #code>

<<< ../demos/PaletteViewerBasic.vue

  </template>
</Demo>

- `palettes` is a list of palettes. Each palette has a `name` and a list of `shades`, each with a `label` such as `500` and a hex `value`.
- Each shade shows its label on the swatch, in black or white, whichever reads better. Under it are the value and the contrast ratio on white and on black. "AA" marks a ratio of 4.5:1 or more.
- A click on a swatch copies its value. A hidden status line says "copied", and the swatch shows a check for a moment.
- Each swatch is a button named by the palette, the shade, and the value. Change the words with `labels` or a [label pack](../guide/translating): `onWhite`, `onBlack`, and the functions `copy` and `copied`.

## Usage

```ts
import { BlessPaletteViewer } from "blessing-ui";
```

## API

<PropsTable name="BlessPaletteViewer" />

<script setup>
import PaletteViewerBasic from "../demos/PaletteViewerBasic.vue";
</script>
