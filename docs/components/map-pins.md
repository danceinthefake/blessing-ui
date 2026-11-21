---
title: Map with pins
---

# Map with pins

<p class="bless-lead">A map from web map tiles with pins that you can select, zoom, and drag</p>

Shows places on a map, such as stores, events, or deliveries. It draws standard web map tiles itself, so the library adds no map package.

<Demo title="Basic">
  <MapPinsBasic />
  <template #code>

<<< ../demos/MapPinsBasic.vue

  </template>
</Demo>

- `v-model:center` is the middle of the map as `[latitude, longitude]`. `v-model:zoom` is a whole number from 1 to 19 (default 13).
- `pins` is the list of places. Each pin has an `id`, a `lat`, an `lng`, and a `label`.
- A pin is a button with its label as the name. A click selects it in `v-model:selected` and shows the label on the map.
- Drag the map to move it. The + and − buttons zoom. When the map has the focus, the arrow keys move it, and the + and − keys zoom.
- `tiles` is a tile URL with `{z}`, `{x}`, and `{y}`. The default is the OpenStreetMap tile server. Its rules ask for light use and the credit. For a busy site, use your own tile server or a paid one.
- `attribution` and `attribution-url` set the credit in the corner. Keep the credit that your tile server asks for.
- `height` sets the height in pixels (default 360). The map takes the width of its box.

The `project` and `unproject` functions turn latitude and longitude into Web Mercator pixels and back. They are exported for your own views.

## Usage

```ts
import { BlessMapPins } from "blessing-ui";
```

## API

<PropsTable name="BlessMapPins" />

<script setup>
import MapPinsBasic from "../demos/MapPinsBasic.vue";
</script>
