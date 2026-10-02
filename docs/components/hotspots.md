---
title: Hotspots
---

<script setup>
import HotspotsBasic from "../demos/HotspotsBasic.vue";
</script>

# Hotspots

<p class="bless-lead">Numbered pins on an image or diagram, with popovers</p>

Point at parts of a picture — a product shot, a floor plan, an annotated screenshot — and say something about each. For a single anchored note, use a [Popover](./popover); for a step-by-step walk through a page, a [Tour](./tour).

<Demo title="Basic">
  <HotspotsBasic />
  <template #code>

<<< ../demos/HotspotsBasic.vue

  </template>
</Demo>

- `v-model` is the list of pins: `{ id, x, y, label }`, with `x` and `y` in percent of the stage, so the pins stay put when the image scales. Numbers follow the order of the list.
- A pin is a button named by its `label`. Click it for a popover; `#spot="{ spot, index }"` fills the popover with anything, and the `label` is the text when you leave the slot out. One popover is open at a time; `v-model:active` reads or sets which.
- Give it `src` and `alt` for an image, or fill the default slot with a diagram, an SVG or a screenshot of your own. Pins sit on top.
- `editable` turns it into an editor: click the stage to add a pin (it opens right away), drag a pin to move it, focus it and use the **arrows** (**Shift** for bigger steps) or **Delete** to remove it. `add` and `remove` fire with the pin.

## Usage

```ts
import { BlessHotspots } from "blessing-ui";
```

## API

<PropsTable name="BlessHotspots" />
