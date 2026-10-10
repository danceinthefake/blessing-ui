---
title: Right-to-left
---

<script setup>
import RtlBasic from "../demos/RtlBasic.vue";
</script>

# Right-to-left

```html
<html dir="rtl" lang="ar"></html>
```

Set `dir="rtl"` on `<html>` or on any subtree, and the library follows. The layout uses logical properties throughout (`inline-start` / `inline-end`, `text-align: start`). Labels, accent edges, badges, input affixes, and card tags mirror without an extra class. The lean flips with the reading direction. `--bless-lean` is redefined under `[dir="rtl"]`. The petal corners are redefined there too, but only after you turn them on. Nothing leans at rest, so hover a control in the demo to see it go the other way. Badges take their direction from their own text, so a Latin "NEW!" stays intact inside Arabic copy. The ← and → keys in tabs, menus, carousels, trees, and steppers follow the reading order, not the physical arrow. The carousel scrolls from its inline start.

Set `lang` too. It controls font selection and hyphenation. `useTheme()` does not manage direction. Direction belongs to your i18n layer, which knows the locale. To try the whole site this way, run `document.documentElement.dir = "rtl"` in the devtools console.

<Demo title="Flip it">
  <RtlBasic />
  <template #code>

<<< ../demos/RtlBasic.vue

  </template>
</Demo>

## What stays physical

Anything you _name_ with a side keeps that side. This is the contract of the prop. It is not a layout default:

- `placement="left"` on popovers, tooltips, dropdowns and hover cards
- `position="top-right"` on watermarks, indicators, toasts, the scroll-to-top button and speed dial
- the `left` / `right` drawers of `BlessLayout` and `BlessStage`, and `side` on `BlessSheet`

If your RTL layout needs the other side, pass the other side.

## Fonts

`--bless-font-sans` lists Roboto and Noto Sans JP. For Arabic or Hebrew, add a script font first in your override, for example `--bless-font-sans: "Noto Sans Arabic", Roboto, …`. The metrics-based sizes carry over unchanged. The letter-spaced uppercase labels are safe. Browsers do not space cursive scripts, so Arabic stays joined.
