# Blessing UI

Design tokens as CSS custom properties. Vue components come later.

```css
@import "blessing-ui/tokens.css";
.btn { background: var(--bless-color-accent); transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out); }
.btn:hover { opacity: var(--bless-hover-opacity); }
```

Prefix: `--bless-`. Groups: `color`, `font`, `text` (fluid clamp), `leading`, `tracking`, `space`, `radius`/`skew`, `shadow`, `duration`/`ease`, `z`.

Reference: `../saenai/DESIGN.md` (source visual language). Only ideas taken — no assets or CSS copied.

Tailwind: not required. If adopted later (v4), map in `@theme { --color-accent: var(--bless-color-accent); }`.

`@custom-media --bless-sp` needs postcss-custom-media; otherwise write `@media (max-width: 800px)` directly.
