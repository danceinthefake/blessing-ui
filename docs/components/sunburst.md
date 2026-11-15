---
title: Sunburst
---

<script setup>
import SunburstBasic from "../demos/SunburstBasic.vue";
</script>

# Sunburst

<p class="bless-lead">A tree of parts as rings around a center</p>

Shows how a whole splits into parts, and how each part splits again. The inner ring is the top level, and each ring out is one level down. For the same data in rectangles that you can open, use the [treemap](./treemap).

<Demo title="Basic">
  <SunburstBasic />
  <template #code>

<<< ../demos/SunburstBasic.vue

  </template>
</Demo>

- `data` takes the same nodes as the treemap. Each node has an `id` and a `label`. A leaf has a `value`, and a parent is the sum of its `children`.
- Each top part gets the next chart color, or its own `color`. The children of a part use a lighter shade of the color of their parent.
- The center shows the total. A hover on a part shows its path, value, and share.
- `size` sets the width of the circle in pixels (default 280), and `format` sets the text of a value.
- For screen readers, the chart is a table with a row for each part, such as "Production › Editing". `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `part`, `value`, `share`, and `total`.

## Usage

```ts
import { BlessSunburst } from "blessing-ui";
```

## API

<PropsTable name="BlessSunburst" />
