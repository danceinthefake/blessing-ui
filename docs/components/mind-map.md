---
title: Mind map
---

<script setup>
import MindMapBasic from "../demos/MindMapBasic.vue";
</script>

# Mind map

<p class="bless-lead">A central idea with its branches on two sides, drawn in SVG</p>

Shows a plan or a set of ideas as one picture, with the main topic in the middle. For a tree that people open and close, use the [tree](./tree).

<Demo title="Basic">
  <MindMapBasic />
  <template #code>

<<< ../demos/MindMapBasic.vue

  </template>
</Demo>

- `root` is the central idea, with a `label` and `children`. Each child can have its own `children`.
- The first half of the main branches goes to the right, and the rest goes to the left. Each main branch gets a chart color, and its lines get thinner at each level.
- The map scales down to fit its box, so a big map gets small text on a phone.
- The picture is hidden from screen readers. A hidden copy of the tree as nested lists takes its place.
- The width of a label comes from its length. If your font is much wider than usual, keep labels short.

The layout follows the mind map that Tony Buzan made known.

## Usage

```ts
import { BlessMindMap } from "blessing-ui";
```

## API

<PropsTable name="BlessMindMap" />
