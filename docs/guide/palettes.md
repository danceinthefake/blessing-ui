# Palettes

<script setup>
import { BlessPaletteToggle } from "blessing-ui";
import PaletteRetint from "../demos/PaletteRetint.vue";
</script>

The accent is Megumi's pink by default. Five more accent families are one switch away — the other petals of the mark, plus the one at its centre. Each is named after a member of the circle the library is named for (the [story](../design/story)). A palette swaps only the accent family; greys, type and geometry stay, and dark mode composes on top.

<div style="margin:16px 0"><BlessPaletteToggle /></div>

<Demo title="Everything chosen re-tints — press the button too">
  <PaletteRetint />
  <template #code>

<<< ../demos/PaletteRetint.vue

  </template>
</Demo>

The petal is the character's colour, used on the mark and the swatches. Fills use `accent`, the petal deepened just enough to carry white text at 4.5:1; text — the active nav item, links, selected rows — uses `accent-text`, a cut that passes 4.5:1 on the background in each theme.

| Palette   | Petal                                                                                                                                     | Accent    | As text   | As text (dark) | Note                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | -------------- | ------------------------------------------------------------------------------ |
| `megumi`  | <span style="display:inline-block;width:14px;height:14px;background:#e85078;border:1px solid var(--bless-color-border)"></span> `#e85078` | `#cc466a` | `#b63c5c` | `#e95b80`      | top petal — the default, no attribute needed                                   |
| `utaha`   | <span style="display:inline-block;width:14px;height:14px;background:#e03028;border:1px solid var(--bless-color-border)"></span> `#e03028` | `#e03028` | `#c62b23` | `#e7625c`      | right petal — red                                                              |
| `izumi`   | <span style="display:inline-block;width:14px;height:14px;background:#4090d0;border:1px solid var(--bless-color-border)"></span> `#4090d0` | `#367ab1` | `#306d9d` | `#63a6db`      | lower-right petal — sky blue                                                   |
| `michiru` | <span style="display:inline-block;width:14px;height:14px;background:#b878b0;border:1px solid var(--bless-color-border)"></span> `#b878b0` | `#996492` | `#885882` | `#b878b0`      | lower-left petal — mauve                                                       |
| `eriri`   | <span style="display:inline-block;width:14px;height:14px;background:#c8e018;border:1px solid var(--bless-color-border)"></span> `#c8e018` | `#6b7e00` | `#5f7000` | `#a3bf0a`      | left petal — `#c8e018` is too pale to carry white, so it becomes `accent-soft` |
| `tomoya`  | <span style="display:inline-block;width:14px;height:14px;background:#5870f8;border:1px solid var(--bless-color-border)"></span> `#5870f8` | `#546aec` | `#4a5dcf` | `#6f84f9`      | the founder's — indigo, not on the mark                                        |

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

`BlessPaletteToggle` is the ready-made control — one swatch per palette, `aria-pressed` on the active one.

The persisted choice is applied after hydration, like the theme; to avoid a one-frame default on a static or server-rendered page, set the attribute in `<head>` — the [no-flash script](./dark-mode#no-flash-on-load) covers both keys.

## Tokens each palette sets

`--bless-color-accent`, `-accent-soft`, `-accent-2`, `-accent-text`, `-badge`, `-chart-1` — plus a dark-mode `accent-text` lifted to 4.5:1 on dark greys. Override any of them after `tokens.css` to tune a palette.

A palette of your own is a new `[data-palette="…"]` block with those tokens, keeping the [accent's contract](./tokens#colour-pairs): `accent` carries white text at 4.5:1, and `accent-text` reaches 4.5:1 on `bg` and `surface` in both themes. Set the attribute on `<html>` yourself.

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

`setPalette()` and `BlessPaletteToggle` know only the built-in six (`blessPalettes`), so a custom one won't appear in the toggle or survive a `setPalette` round-trip.
