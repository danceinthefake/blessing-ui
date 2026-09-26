# Tokens

All styling reads `--bless-*` custom properties from `tokens.css` — 89 of them. Override on `:root` to retheme the whole app; override on a subtree to change individual values there (a palette or dark mode, which are attribute-driven on `<html>`, stay app-wide).

```css
:root {
  --bless-color-accent: #4090d0;
  --bless-lean: -6deg;
}
```

| Group              | Props                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,accent-text,danger,danger-text,badge,warning,success,info,info-text,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}` |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                                                  |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,headline,display}` — fluid `clamp()`, 8→151px; `headline` is the hanging page title (36–73px), `display` the watermark                                                                             |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                                                  |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` — 4px base                                                                                                                                                                                       |
| Shape              | `--bless-lean`, `--bless-skew`, `--bless-skew-counter`, `--bless-petal`, `--bless-radius-petal` (+`-lg`), `--bless-radius`, `--bless-radius-plate` (0, override points), `--bless-border-width`, `--bless-dash-width`                |
| Elevation          | `--bless-shadow-plate` (`1px 1px 0` accent, via `--bless-plate-offset`), `--bless-shadow-none`; `--bless-shadow-md` is an alias of plate                                                                                             |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                                                       |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`, `--bless-safe-{top,right,bottom,left}` (`env(safe-area-inset-*)`, for notches)                                                  |

Durations collapse to `0s` under `prefers-reduced-motion`.

## What flips, what swaps

- **[Dark mode](./dark-mode)** redefines the greys and what sits on them: `text`, `text-muted`, `bg`, `surface`, `surface-2`, `watermark`, `border`, `rule`, `backdrop`, `danger`, `danger-text`, `info-text`, `accent-text`, `chart-2..5`, and `font-weight-thin` (100 → 300, hairlines read thinner light-on-dark). The accent family is untouched.
- **A [palette](./palettes)** swaps only the accent family: `accent`, `accent-soft`, `accent-2`, `accent-text`, `badge`, `chart-1`. Greys, type and geometry stay.
- **[Right-to-left](./rtl)** mirrors `lean` and the petal corners.

## Shape

Two corners, one rule — see [Conventions](./conventions#shape-cut-or-petal). `--bless-lean` is the house angle; `--bless-skew` / `--bless-skew-counter` are the current lean every plate and its text read — `0deg` at rest, set to the lean on hover, focus, press or while writing. Set `--bless-skew: var(--bless-lean)` (and the counter to its negative) on an element to make it lean at rest; set `--bless-lean: 0deg` to turn the lean off. `--bless-radius-petal` rounds only the two acute corners of a leaning plate (`--bless-petal`, 8px; `-lg` for chat bubbles) and is applied to avatars, switches, chips, bubbles, fabs and thumbs. `--bless-radius` and `--bless-radius-plate` are `0` and unused by the library; set them if you want boxes or plates rounded.

## Colour pairs

- `accent-text` — the accent **as text** on `bg`/`surface`: darkened per palette to ≥4.5:1 (links, active nav, selected rows). Fills use `accent`, deepened per palette to carry white text at 4.5:1; as text on the page it's too light, so use `accent-text`.
- `danger` / `danger-text` — `danger` is the fill (destructive buttons, invalid borders); `danger-text` is error copy, ≥4.5:1 on `bg` and `surface`. They're the same red in light mode; dark mode lifts the text one so it stays readable on the dark greys, where no single red could be both.
- `info` / `info-text` — the same split: `info-text` for info as text (outline badges, alert titles).
- `on-accent` — text on any accent / danger / info fill (white).
- `on-text` — text on a `--bless-color-text` fill; equals `bg`, so it inverts with the theme.
- `on-light` — text on warning / success fills, which are too pale for white.
- `chart-1..5` — categorical series, all ≥3:1 on `bg` and `surface` in both themes.

## Tailwind v4

Tokens are plain custom properties, so they slot into Tailwind's `@theme` and come out as utilities (`bg-accent`, `text-text`, `border-border`…). Blessing itself doesn't depend on Tailwind.

```css
@theme {
  --color-accent: var(--bless-color-accent);
  --color-text: var(--bless-color-text);
  --color-border: var(--bless-color-border);
}
```
