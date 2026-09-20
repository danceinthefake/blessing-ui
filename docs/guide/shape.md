---
title: Shape
---

<script setup>
import ShapeToggleBasic from "../demos/ShapeToggleBasic.vue";
</script>

# Shape

The default is the sharp parallelogram — the plates of the mark. `<html data-shape="rounded">` keeps the lean and rounds three kinds of thing three ways:

- **Pills** — badges, chips, switches, avatars, progress — become pills (`--bless-radius-pill`). Round by convention everywhere; the sharp default's one real weakness.
- **Skewed plates** — buttons, tabs, tags, fields, pickers, steps, pagination — round **only their two acute corners** (`--bless-radius-plate`). The plate stays a cut plate, not a lozenge; the tips soften. Nobody else has this shape, and it rhymes with the circle's flower: soft body, sharp point.
- **Boxes** — cards, panels, menus, popovers, tables — take a plain `--bless-radius` (8px).

Palettes, dark mode and RTL compose with it (the acute corners flip with the lean).

<Demo title="Flip it">
  <ShapeToggleBasic />
  <template #code>

<<< ../demos/ShapeToggleBasic.vue

  </template>
</Demo>

## Use

```html
<html data-shape="rounded"></html>
```

or from code — persisted in `localStorage` like the theme and palette:

```ts
import { useTheme } from "blessing-ui";
const { shape, setShape } = useTheme();
setShape("rounded");
```

`BlessShapeToggle` is the ready-made control. To tune the radii, override the two tokens after `tokens.css`:

```css
:root[data-shape="rounded"] {
  --bless-radius: 6px; /* boxes; plates derive their acute corners from it */
  --bless-radius-pill: 999px;
}
```

There is no upright (un-skewed) variant, and no fully-rounded plate: rounded corners without the lean is every other library; the lean is the point. The source site never rounded anything — this mode is our departure, off by default.
