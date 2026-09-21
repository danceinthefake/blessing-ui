# Tokens

All styling reads `--bless-*` custom properties from `tokens.css` — 87 of them. Override on `:root` to retheme the whole app; override on a subtree to change individual values there (a palette or dark mode, which are attribute-driven on `<html>`, stay app-wide).

```css
:root {
  --bless-color-accent: #4090d0;
  --bless-skew: -6deg;
}
```

| Group              | Props                                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,accent-text,danger,badge,warning,success,info,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}` |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                            |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,headline,display}` — fluid `clamp()`, 8→151px; `headline` is the hanging page title (36–73px), `display` the watermark                                                       |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                            |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` — 4px base                                                                                                                                                                 |
| Shape              | `--bless-skew`, `--bless-skew-counter`, `--bless-petal`, `--bless-radius-petal` (+`-lg`), `--bless-radius`, `--bless-radius-plate` (0, override points), `--bless-border-width`, `--bless-dash-width`          |
| Elevation          | `--bless-shadow-plate` (`1px 1px 0` accent, via `--bless-plate-offset`), `--bless-shadow-none`; `--bless-shadow-md` is an alias of plate                                                                       |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                                 |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`, `--bless-safe-{top,right,bottom,left}` (`env(safe-area-inset-*)`, for notches)                            |

Durations collapse to `0s` under `prefers-reduced-motion`.

## What flips, what swaps

- **[Dark mode](./dark-mode)** redefines the greys and what sits on them: `text`, `text-muted`, `bg`, `surface`, `surface-2`, `watermark`, `border`, `rule`, `backdrop`, `danger`, `accent-text`, `chart-2..5`, and `font-weight-thin` (100 → 300, hairlines read thinner light-on-dark). The accent family is untouched.
- **A [palette](./palettes)** swaps only the accent family: `accent`, `accent-soft`, `accent-2`, `accent-text`, `badge`, `chart-1`. Greys, type and geometry stay.
- **[Right-to-left](./rtl)** mirrors `skew`, `skew-counter` and the petal corners.

## Shape

Two corners, one rule — see [Conventions](./conventions#shape-cut-or-petal). `--bless-skew` is the lean on everything. `--bless-radius-petal` rounds only the two acute corners of a leaning plate (`--bless-petal`, 8px; `-lg` for chat bubbles) and is applied to avatars, switches, chips, bubbles, fabs and thumbs. `--bless-radius` and `--bless-radius-plate` are `0` and unused by the library; set them if you want boxes or plates rounded.

## Colour pairs

- `accent-text` — the accent **as text** on `bg`/`surface`: darkened per palette to ≥4.5:1 (links, active nav, selected rows). Fills keep `accent`; white on it is 3.6:1, which is AA for UI components and large text, not for body copy — so never set small text in `accent` itself.
- `danger` — 4.9:1 both as text on `bg` and under white, so one token serves error copy and destructive fills.
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
