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

Set `dir="rtl"` on `<html>` — or on any subtree — and the library follows: layout uses logical properties throughout (`inline-start` / `inline-end`, `text-align: start`), so labels, accent edges, badges, input affixes and card tags mirror without any extra class. The lean flips with the reading direction, and so do the petal's rounded corners (`--bless-lean` and `--bless-radius-petal` are redefined under `[dir="rtl"]`). ← / → keys in tabs, menus, carousels, trees and steppers follow reading order rather than the physical arrow, and the carousel scrolls from its inline start.

Set `lang` too — it drives font selection and hyphenation. Direction is not something `useTheme()` manages; it belongs to your i18n layer, which knows the locale. To try the whole site this way, run `document.documentElement.dir = "rtl"` in the devtools console.

<Demo title="Flip it">
  <RtlBasic />
  <template #code>

<<< ../demos/RtlBasic.vue

  </template>
</Demo>

## What stays physical

Anything you _name_ with a side keeps that side — that's the contract of the prop, not a layout default:

- `placement="left"` on popovers, tooltips, dropdowns and hover cards
- `position="top-right"` on watermarks, indicators, toasts, the scroll-to-top button and speed dial
- the `left` / `right` drawers of `BlessLayout` and `BlessStage`, and `side` on `BlessSheet`

Pass the other side when your RTL layout wants it.

## Fonts

`--bless-font-sans` lists Roboto and Noto Sans JP. For Arabic or Hebrew, add a script font first in your override — e.g. `--bless-font-sans: "Noto Sans Arabic", Roboto, …` — the metrics-based sizes carry over unchanged.
