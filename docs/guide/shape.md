---
title: Shape
---

<script setup>
import ShapeToggleBasic from "../demos/ShapeToggleBasic.vue";
</script>

# Shape

The default is the sharp parallelogram — the plates of the mark. `<html data-shape="rounded">` keeps the lean and rounds every corner: boxes take `--bless-radius` (8px), pills — badges, chips, switches, avatars, progress — take `--bless-radius-pill`. Nothing else changes; palettes and dark mode compose with it.

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
  --bless-radius: 6px;
  --bless-radius-pill: 999px;
}
```

There is no upright (un-skewed) variant. Rounded corners without the lean is every other library; the lean is the point.
