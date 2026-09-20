# Palettes

<script setup>
import { BlessPaletteToggle, BlessButton, BlessBadge, BlessSwitch, BlessProgress } from "blessing-ui";
</script>

The accent is Megumi's pink by default. Five more accent families are one switch away — the other petals of the mark, plus the one at its centre. Each is named after a member of the circle the library is named for (the [story](./story)). A palette swaps only the accent family; greys, type and geometry stay, and dark mode composes on top.

<div style="margin:16px 0"><BlessPaletteToggle /></div>

<Demo title="Everything re-tints">
  <div class="row">
    <BlessButton color="accent">Accent</BlessButton>
    <BlessButton variant="outline" color="accent">Outline</BlessButton>
    <BlessBadge color="accent" :scaled="false">EP.12</BlessBadge>
    <BlessSwitch :model-value="true">On</BlessSwitch>
  </div>
  <div class="col" style="margin-top:12px"><BlessProgress :value="64" show-value label="Progress" /></div>
</Demo>

| Palette   | Petal                                                                                                                  | Accent    | Note                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `megumi`  | <span style="display:inline-block;width:14px;height:14px;background:#e85078;transform:skewX(-10deg)"></span> `#e85078` | `#e85078` | top petal — the default, no attribute needed                                                    |
| `utaha`   | <span style="display:inline-block;width:14px;height:14px;background:#e03028;transform:skewX(-10deg)"></span> `#e03028` | `#e03028` | right petal                                                                                     |
| `izumi`   | <span style="display:inline-block;width:14px;height:14px;background:#4090d0;transform:skewX(-10deg)"></span> `#4090d0` | `#4090d0` | lower-right petal                                                                               |
| `michiru` | <span style="display:inline-block;width:14px;height:14px;background:#b878b0;transform:skewX(-10deg)"></span> `#b878b0` | `#b878b0` | lower-left petal                                                                                |
| `eriri`   | <span style="display:inline-block;width:14px;height:14px;background:#c8e018;transform:skewX(-10deg)"></span> `#c8e018` | `#7f9600` | left petal — too light for white text, so it becomes `accent-soft` and the ink darkens to 3.4:1 |
| `tomoya`  | <span style="display:inline-block;width:14px;height:14px;background:#5870f8;transform:skewX(-10deg)"></span> `#5870f8` | `#5870f8` | the centre of the circle — not on the mark                                                      |

## Use

```html
<html data-palette="utaha"></html>
```

```ts
import { useTheme, blessPalettes } from "blessing-ui";
const { palette, setPalette } = useTheme(); // persisted in localStorage("bless-palette")
setPalette("izumi");
setPalette("megumi"); // back to the default
```

`BlessPaletteToggle` is the ready-made control — one skewed swatch per palette, `aria-pressed` on the active one.

## Tokens each palette sets

`--bless-color-accent`, `-accent-soft`, `-accent-2`, `-accent-text`, `-badge`, `-chart-1`. Override any of them after `tokens.css` to tune a palette; add your own with a new `[data-palette="…"]` block.
