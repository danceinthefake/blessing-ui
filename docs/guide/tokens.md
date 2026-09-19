# Tokens

All styling reads `--bless-*` custom properties from `tokens.css`. Override on `:root`, or on any subtree, to theme.

```css
:root {
  --bless-color-accent: #4090d0;
  --bless-skew: -6deg;
}
```

| Group              | Props                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour             | `--bless-color-{text,text-muted,bg,surface,surface-2,watermark,accent,accent-soft,accent-2,danger,badge,warning,success,info,on-accent,on-text,on-light,border,rule,backdrop,media-bg,chart-1..5}` |
| Font               | `--bless-font-sans`, `--bless-font-weight-{thin,light,normal,bold}`                                                                                                                                |
| Type scale         | `--bless-text-{2xs,xs,sm,md,lg,xl,display}` — fluid `clamp()`, 8→151px                                                                                                                             |
| Leading / tracking | `--bless-leading-{none,tight,normal}`, `--bless-tracking-{tight,normal,wide,wider}`                                                                                                                |
| Space              | `--bless-space-{1,2,3,4,6,8,12,16}` — 4px base                                                                                                                                                     |
| Shape              | `--bless-radius-{none,sm}`, `--bless-skew`, `--bless-skew-counter`, `--bless-border-width`, `--bless-dash-width`                                                                                   |
| Elevation          | `--bless-shadow-{none,md}`                                                                                                                                                                         |
| Motion             | `--bless-duration-{fast,base,slow,slower}`, `--bless-ease-{in-out,out,linear}`, `--bless-hover-opacity`, `--bless-press-scale`                                                                     |
| Layout             | `--bless-sidebar-width`, `--bless-sidebar-inner`, `--bless-content-max`, `--bless-z-{bg,nav,modal}`                                                                                                |

Durations collapse to `0s` under `prefers-reduced-motion`.

## Semantic pairs

- `accent`, `accent-soft`, `accent-2`, `badge`, `chart-1` — the accent family; this is what a [palette](./palettes) swaps

- `on-accent` — text on any accent / danger / info fill (white)
- `on-text` — text on a `--bless-color-text` fill; equals `bg`, so it inverts with the theme
- `on-light` — text on warning / success fills, which are too pale for white
- `chart-1..5` — categorical series, all ≥3:1 on `bg` and `surface` in both themes

## Tailwind v4

```css
@theme {
  --color-accent: var(--bless-color-accent);
  --color-text: var(--bless-color-text);
}
```
