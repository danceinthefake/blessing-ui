---
title: Dock
---

<script setup>
import DockBasic from "../demos/DockBasic.vue";
</script>

# Dock

<p class="bless-lead">A strip of app icons that swell under the pointer</p>

A row (or column) of big icon buttons for the handful of places someone returns to — an app launcher, a pinned set of tools, a mobile-style home bar. The icon under the pointer grows and its neighbours follow; the label appears above. For the main navigation of a site use [NavigationMenu](./navigation-menu) or [BottomTabs](./bottom-tabs), which carry text.

<Demo title="Bottom and side">
  <DockBasic />
  <template #code>

<<< ../demos/DockBasic.vue

  </template>
</Demo>

- `items` are `{ id, label, icon?, href?, badge?, disabled? }`. An item with `href` is a link, the rest are buttons; `select` fires on click. `icon` is a character or emoji — the `#item` slot draws an image or [Icon](./icon) instead.
- It is a toolbar: one tab stop, **arrows** along the dock (← → on the bottom, ↑ ↓ on the sides, mirrored under RTL), **Home** / **End** jump, disabled buttons are skipped. Every item is named by `label`, so the growing and the tooltip are decoration. A keyboard-focused item grows as well.
- `position` is the edge it sits on: it sets the direction, where icons grow from and which arrows work. `magnification` (1.6) is how much the nearest icon grows, `radius` the reach in px; `:magnification="1"` turns it off. Touch never magnifies, and nor does `prefers-reduced-motion`.
- Growth is a transform, so nothing around the dock moves.

## Usage

```ts
import { BlessDock } from "blessing-ui";
```

## API

<PropsTable name="BlessDock" />
