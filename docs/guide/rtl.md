---
title: Right-to-left
---

<script setup>
import RtlBasic from "../demos/RtlBasic.vue";
</script>

# Right-to-left

Set `dir="rtl"` on `<html>` — or on any subtree — and the library follows: layout uses logical properties throughout (`inline-start` / `inline-end`, `text-align: start`), so labels, accent edges, badges, input affixes and card tags mirror without any extra class. The parallelogram skew flips with the reading direction (`--bless-skew` is redefined under `[dir="rtl"]`), and ← / → keys in tabs, menus, carousels, trees and steppers follow reading order rather than the physical arrow.

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

Pass the other side when your RTL layout wants it. Carousel and gallery arrows mirror, but their swipe/scroll direction is the browser's native RTL behaviour.

## Fonts

`--bless-font-sans` lists Roboto and Noto Sans JP. For Arabic or Hebrew, add a script font first in your override — e.g. `--bless-font-sans: "Noto Sans Arabic", Roboto, …` — the metrics-based sizes carry over unchanged.
