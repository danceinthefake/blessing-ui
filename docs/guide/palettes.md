# Palettes

<script setup>
import { BlessPaletteToggle, BlessButton, BlessBadge, BlessSwitch, BlessProgress, BlessSidebarNav } from "blessing-ui";
</script>

The accent is Megumi's pink by default. Five more accent families are one switch away — the other petals of the mark, plus the one at its centre. Each is named after a member of the circle the library is named for (the [story](./story)). A palette swaps only the accent family; greys, type and geometry stay, and dark mode composes on top.

<div style="margin:16px 0"><BlessPaletteToggle /></div>

<Demo title="Everything re-tints">
  <div class="row">
    <BlessButton color="accent">Accent</BlessButton>
    <BlessButton variant="outline" color="accent">Outline</BlessButton>
    <BlessBadge color="accent">EP.12</BlessBadge>
    <BlessSwitch :model-value="true">On</BlessSwitch>
  </div>
  <div class="col" style="margin-top:12px"><BlessProgress :value="64" show-value label="Progress" /></div>
  <div style="margin-top:16px;max-width:220px"><BlessSidebarNav :items="[{ label: 'News', href: '#news', badge: true }, { label: 'On Air', href: '#onair' }]" active="#news" @select="(_, e) => e.preventDefault()" /></div>
</Demo>

The petal is the character's colour, used on the mark and the swatches. Fills use `accent`, the petal deepened just enough to carry white text at 4.5:1; text — the active nav item, links, selected rows — uses `accent-text`, a cut that passes 4.5:1 on the background in each theme.

| Palette   | Petal                                                                                                                  | Accent    | As text   | Note                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | --------- | ------------------------------------------------------------------------------ |
| `megumi`  | <span style="display:inline-block;width:14px;height:14px;background:#e85078;transform:skewX(-10deg)"></span> `#e85078` | `#cc466a` | `#b63c5c` | top petal — the default, no attribute needed                                   |
| `utaha`   | <span style="display:inline-block;width:14px;height:14px;background:#e03028;transform:skewX(-10deg)"></span> `#e03028` | `#e03028` | `#cc2c24` | right petal — red                                                              |
| `izumi`   | <span style="display:inline-block;width:14px;height:14px;background:#4090d0;transform:skewX(-10deg)"></span> `#4090d0` | `#367ab1` | `#3270a2` | lower-right petal — sky blue                                                   |
| `michiru` | <span style="display:inline-block;width:14px;height:14px;background:#b878b0;transform:skewX(-10deg)"></span> `#b878b0` | `#996492` | `#8c5b86` | lower-left petal — mauve                                                       |
| `eriri`   | <span style="display:inline-block;width:14px;height:14px;background:#c8e018;transform:skewX(-10deg)"></span> `#c8e018` | `#6b7e00` | `#627300` | left petal — `#c8e018` is too pale to carry white, so it becomes `accent-soft` |
| `tomoya`  | <span style="display:inline-block;width:14px;height:14px;background:#5870f8;transform:skewX(-10deg)"></span> `#5870f8` | `#546aec` | `#4c60d5` | the founder's — indigo, not on the mark                                        |

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

The persisted choice is applied after hydration, like the theme; to avoid a one-frame default on a static or server-rendered page, set the attribute in `<head>` — the [no-flash script](./dark-mode#no-flash-on-load) covers both keys.

## Tokens each palette sets

`--bless-color-accent`, `-accent-soft`, `-accent-2`, `-accent-text`, `-badge`, `-chart-1` — plus a dark-mode `accent-text` lifted to 4.5:1 on dark greys. Override any of them after `tokens.css` to tune a palette.

A palette of your own is a new `[data-palette="…"]` block with those tokens; set the attribute on `<html>` yourself. `setPalette()` and `BlessPaletteToggle` know only the built-in six (`blessPalettes`), so a custom one won't appear in the toggle or survive a `setPalette` round-trip.
