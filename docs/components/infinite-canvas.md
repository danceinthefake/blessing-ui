---
title: InfiniteCanvas
---

<script setup>
import InfiniteCanvasBasic from "../demos/InfiniteCanvasBasic.vue";
</script>

# InfiniteCanvas

<p class="bless-lead">A surface you pan and zoom, with your own things on it</p>

A viewport onto a larger plane: a story board, a flow editor, a map-like diagram, a photo wall. Whatever you put inside is positioned in the canvas' own coordinates and moves and scales with the view. For a list the reader scrolls, use [ScrollArea](./scroll-area); for a diagram with draggable nodes and links, [NodeGraph](./node-graph) is built on this.

<Demo title="Board of cards">
  <InfiniteCanvasBasic />
  <template #code>

<<< ../demos/InfiniteCanvasBasic.vue

  </template>
</Demo>

- Place children with `position: absolute; left; top` in canvas coordinates — the origin is where `view.x, view.y` puts it. The canvas needs a height (it fills the width).
- Mouse and pen: drag the background to pan (middle button works over children too); the wheel pans, **Ctrl+wheel** or a trackpad pinch zooms around the pointer, `wheelZoom` makes the plain wheel zoom. Touch: one finger pans, two pinch and pan.
- Keyboard: focus the canvas, **arrows** pan (Shift: further), **+ / −** zoom, **0** or **Home** resets, and the zoom is announced. Keys pressed inside a child belong to the child. Buttons in the corner zoom and reset (`:controls="false"` hides them).
- `v-model:view` is `{ x, y, zoom }`. The exposed `fit(rect)`, `centerOn(x, y)`, `zoomBy(factor)`, `reset()` and `toWorld(clientX, clientY)` drive and read it; children can `inject(blessCanvasKey)` for the view and `toWorld`.
- `minZoom` / `maxZoom` bound the zoom; `grid` draws a dot grid that moves and scales with the view.

## Usage

```ts
import { BlessInfiniteCanvas, blessCanvasKey } from "blessing-ui";
```

## API

<PropsTable name="BlessInfiniteCanvas" />
