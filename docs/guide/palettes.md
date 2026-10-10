# Palettes

<script setup>
import { BlessPaletteToggle } from "blessing-ui";
import PaletteRetint from "../demos/PaletteRetint.vue";
</script>

The accent is Megumi's pink by default. Five more accent families are one switch away: the other petals of the mark, and the one at its center. Each is named after a member of the circle that gave the library its name (see the [story](../design/story)). A palette swaps only the accent family. Grays, type, and geometry stay the same, and dark mode composes on top.

<div style="margin:16px 0"><BlessPaletteToggle /></div>

<Demo title="Everything chosen re-tints — press the button too">
  <PaletteRetint />
  <template #code>

<<< ../demos/PaletteRetint.vue

  </template>
</Demo>

The petal is the color of the character. The mark and the swatches use it. Fills use `accent`, the petal deepened just enough to carry white text at 4.5:1. Text uses `accent-text`, a cut that passes 4.5:1 on the background in each theme. Text includes the active nav item, links, and selected rows.

| Palette   | Petal                                                                                                                                     | Accent    | As text   | As text (dark) | Note                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | -------------- | ----------------------------------------------------------------------------- |
| `megumi`  | <span style="display:inline-block;width:14px;height:14px;background:#e85078;border:1px solid var(--bless-color-border)"></span> `#e85078` | `#cc466a` | `#b63c5c` | `#e95b80`      | top petal: the default, no attribute needed                                   |
| `utaha`   | <span style="display:inline-block;width:14px;height:14px;background:#e03028;border:1px solid var(--bless-color-border)"></span> `#e03028` | `#e03028` | `#c62b23` | `#e7625c`      | right petal: red                                                              |
| `izumi`   | <span style="display:inline-block;width:14px;height:14px;background:#4090d0;border:1px solid var(--bless-color-border)"></span> `#4090d0` | `#367ab1` | `#306d9d` | `#63a6db`      | lower-right petal: sky blue                                                   |
| `michiru` | <span style="display:inline-block;width:14px;height:14px;background:#b878b0;border:1px solid var(--bless-color-border)"></span> `#b878b0` | `#996492` | `#885882` | `#b878b0`      | lower-left petal: mauve                                                       |
| `eriri`   | <span style="display:inline-block;width:14px;height:14px;background:#c8e018;border:1px solid var(--bless-color-border)"></span> `#c8e018` | `#6b7e00` | `#5f7000` | `#a3bf0a`      | left petal: `#c8e018` is too pale to carry white, so it becomes `accent-soft` |
| `tomoya`  | <span style="display:inline-block;width:14px;height:14px;background:#5870f8;border:1px solid var(--bless-color-border)"></span> `#5870f8` | `#546aec` | `#4a5dcf` | `#6f84f9`      | the founder's: indigo, not on the mark                                        |

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

`BlessPaletteToggle` is the ready-made control. It shows one swatch per palette and sets `aria-pressed` on the active one.

The library applies the saved choice after hydration, like the theme. On a static or server-rendered page, this causes one frame of the default palette. To avoid that frame, set the attribute in `<head>`. The [no-flash script](./dark-mode#no-flash-on-load) covers both keys.

## Tokens each palette sets

These tokens make up a palette: `--bless-color-accent`, `-accent-soft`, `-accent-2`, `-accent-text`, `-badge`, and `-chart-1`. A dark-mode `accent-text` is also lifted to 4.5:1 on dark grays. To tune a palette, override any of them after `tokens.css`.

A palette of your own is a new `[data-palette="…"]` block with those tokens, keeping the [accent's contract](./tokens#color-pairs): `accent` carries white text at 4.5:1, and `accent-text` reaches 4.5:1 on `bg` and `surface` in both themes. Set the attribute on `<html>` yourself.

```css
:root[data-palette="kato"] {
  --bless-color-accent: #b0406a; /* fills: white text on it ≥ 4.5:1 */
  --bless-color-accent-text: #a13a61; /* text on bg/surface ≥ 4.5:1 (light) */
  --bless-color-accent-soft: #f2b3c8; /* highlights */
  --bless-color-accent-2: #d06088; /* hover step */
  --bless-color-badge: #b0406a; /* BlessBadge color="badge" */
  --bless-color-chart-1: #b0406a;
}
/* dark greys need a lighter text cut (repeat under @media (prefers-color-scheme: dark) if you follow the OS) */
:root[data-palette="kato"][data-theme="dark"] {
  --bless-color-accent-text: #ec7aa2;
}
```

`setPalette()` and `BlessPaletteToggle` know only the six built-in palettes (`blessPalettes`). A custom palette does not appear in the toggle and does not survive a `setPalette` round-trip.
