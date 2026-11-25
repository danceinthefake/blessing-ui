# Tokens

All styling reads the `--bless-*` custom properties from `tokens.css`. There are 91 of them. To retheme the whole app, override them on `:root`. To change individual values in a subtree, override them on that subtree. A palette and dark mode stay app-wide, because they are attribute-driven on `<html>`.

```css
:root {
  --bless-lean: -6deg; /* a gentler lean */
  --bless-font-sans: "Inter", system-ui, sans-serif;
}
```

To change the accent, pick a [palette](./palettes) or define a whole one. The accent is a family (`accent`, `accent-text`, `accent-soft`, `accent-2`, `badge`, `chart-1`) with contrast rules. If you change `accent` alone, the rest stays on Megumi's pink.

<Demo title="Color tokens — live; flip the theme or palette in the nav">
  <TokenSwatches />
</Demo>

| Group              | Props                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Color              | `--bless-color-{text,text-muted,bg,surface,surface-glass,surface-2,watermark,accent,accent-soft,accent-2,accent-text,danger,danger-text,badge,warning,success,info,info-text,on-accent,on-text,on-light,border,hover,rule,backdrop,media-bg,chart-1..5}`, `--bless-light`, `--bless-sky`, `--bless-edge` |
| Font               | `--bless-font-sans`, `--bless-font-serif`, `--bless-font-mono`, `--bless-font-weight-{thin,light,normal,medium,bold}`                                                                                                               |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,headline,display}`: fluid `clamp()`, 8→151px. `headline` is the hanging page title (36–73px). `display` is the watermark                                                                           |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                                                  |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}`: 4px base                                                                                                                                                                                        |
| Shape              | `--bless-lean`, `--bless-skew`, `--bless-skew-counter`, `--bless-radius` (`14px`), `--bless-radius-plate` (`6px`), `--bless-radius-pill` (`999px`), `--bless-petal` (`999px`), `--bless-border-width`, `--bless-dash-width`          |
| Elevation          | `--bless-shadow-sm`, `--bless-shadow-plate`, `--bless-shadow-art`, `--bless-shadow-none`. `--bless-shadow-md` is an alias of plate                                                                                                   |
| Motion             | `--bless-duration-{fast,base,slow,slower,enter,voice,flair,draw}`, `--bless-ease-{in-out,out,soft,snap,pop,spring,linear}`, `--bless-hover-opacity` (`1`), `--bless-hover-lift` (`-1.5px`), `--bless-press-scale`, `--bless-lean-transition` |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`, `--bless-safe-{top,right,bottom,left}` (`env(safe-area-inset-*)`, for notches)                                                  |

Durations collapse to `0s` and `--bless-hover-lift` collapses to `0px` under `prefers-reduced-motion`.

## What flips, what swaps

- **[Moods & dark mode](./dark-mode)** redefines the paper, sky, and ink tokens for **Golden hour** (`data-theme="golden"`) and **Night** (`data-theme="dark"`): `text`, `text-muted`, `bg`, `surface`, `surface-glass`, `surface-2`, `watermark`, `border`, `hover`, `rule`, `backdrop`, `light`, `sky`, `edge`, `danger`, `danger-text`, `info-text`, `accent-text`, `chart-2..5`, and `font-weight-thin`. The accent family stays untouched.
- **A [palette](./palettes)** swaps only the accent family: `accent`, `accent-soft`, `accent-2`, `accent-text`, `badge`, `chart-1`. Paper, skies, type, and geometry stay.
- **[Right-to-left](./rtl)** mirrors `lean` and logical edges.

## Shape

See [Conventions](./conventions#shape). `--bless-radius` (`14px`) softens cards and popovers, `--bless-radius-pill` (`999px`) rounds buttons, switches, chips, and soft-wash badges, `--bless-radius-plate` (`6px`) shapes skewed rectangular tags and `BlessNovelBox` nameplates, and `--bless-petal` (`999px`) makes avatars and portraits circular. Manuscript underline inputs stay flat (`0px`). `--bless-lean` (`-10deg`, mirrored in RTL) is reserved for rectangular tags, eyecatches, speaker nameplates, watermarks, and explicit `.bless-lean` plates. To turn off rounding or lean globally, override the tokens to `0` / `0deg`.

## Color pairs

- `accent-text`: the accent **as text** on `bg` or `surface`. It is darkened per palette to at least 4.5:1 (links, active nav, selected rows). Fills use `accent`, deepened per palette to carry white text at 4.5:1. As text on the page, `accent` is too light, so use `accent-text`.
- **The accent's contract**, for any palette of your own: `accent` must carry white text at 4.5:1, and `accent-text` must reach 4.5:1 on `bg` and `surface` in both themes.
- `badge`: used by `BlessBadge color="badge"` and notification counts. It is a step of the accent family, so it re-tints with the palette and carries white at 4.5:1. Badges are ink by default.
- `danger` / `danger-text`: `danger` is the fill (destructive buttons, invalid borders). `danger-text` is error copy, at least 4.5:1 on `bg` and `surface`. They are the same red in light mode. Dark mode lifts the text one step, so it stays readable on the dark grays. No single red can do both jobs there.
- `info` / `info-text`: the same split. `info-text` is for info as text (outline badges, alert titles).
- `on-accent`: text on any accent, danger, or info fill (white).
- `on-text`: text on a `--bless-color-text` fill. It equals `bg`, so it inverts with the theme.
- `on-light`: text on warning and success fills, which are too pale for white.
- `chart-1..5`: categorical series. All are at least 3:1 on `bg` and `surface` in both themes.

## Tailwind v4

Tokens are plain custom properties, so they slot into the Tailwind `@theme`. They come out as utilities (`bg-accent`, `text-text`, `border-border`, and others). Blessing itself does not depend on Tailwind.

```css
@theme {
  --color-accent: var(--bless-color-accent);
  --color-text: var(--bless-color-text);
  --color-border: var(--bless-color-border);
}
```

<script setup>
import TokenSwatches from "../demos/TokenSwatches.vue";
</script>
