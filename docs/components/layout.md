---
title: Layout
---

<script setup>
import { withBase } from "vitepress";
</script>

# Layout

<p class="bless-lead">App shell: sticky header that hides on scroll down, footer, left / right drawers that sit beside the page on wide screens and slide over it below the breakpoint, edge-swipe to open on touch, safe-area padding for notches and the home bar.</p>

## When to use

The shell for an *application* — dashboards, admin tools, mobile apps — where the same header, footer and side drawers frame every screen. It handles the part that's always fiddly: drawers that are permanent columns on a desktop and off-canvas panels on a phone, with edge-swipe, a backdrop, Escape and `inert` on the hidden one. For a content site with a fixed sidebar in the saenai style, use `BlessStage`.

`BlessLayout` owns the viewport, so it can't sit inside a doc page. Open it full-page and resize the window:

<p><a class="VPButton medium brand" :href="withBase('/layout-demo')" target="_blank" style="display:inline-block;padding:0 20px;line-height:38px;color:var(--bless-color-on-accent);background:var(--bless-color-accent);text-decoration:none">Open Layout demo ↗</a></p>

<<< ../demos/LayoutFull.vue

`BlessStage` is the saenai-style sidebar page; `BlessLayout` is the general app shell (Quasar's QLayout shape).

## Usage

```ts
import { BlessLayout } from "blessing-ui";
```

## API

<PropsTable name="BlessLayout" />
