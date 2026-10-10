---
title: Layout
---

# Layout

<p class="bless-lead">App shell with a sticky header that hides on scroll down, a footer, and left and right drawers. The drawers sit beside the page on wide screens and slide over it below the breakpoint. It has edge-swipe to open on touch, and safe-area padding for notches and the home bar.</p>

An app shell: header, page, and side drawers that sit beside the page on wide screens and over it on narrow ones. For an official site's frame with a fixed sidebar, [Stage](./stage).

Dashboards, admin tools, mobile apps: the same header, footer and drawers frame every screen.

`BlessLayout` owns the viewport, so it cannot sit inside a doc page. Open it and resize the window:

[Open Layout on a page of its own ↗](/layout-example){target="_blank"}

<<< ../demos/LayoutFull.vue

- On narrow screens a drawer opens over the page (`v-model:left` / `v-model:right`): focus moves into it, and Esc or the backdrop closes it and returns focus. Closed, it is inert. A swipe from the edge opens it on touch (`swipe`).
- `reveal` hides the header while scrolling down and brings it back on the way up. `breakpoint` sets where drawers move beside the page.

## Usage

```ts
import { BlessLayout } from "blessing-ui";
```

## API

<PropsTable name="BlessLayout" />
