---
title: Sankey
---

# Sankey

<p class="bless-lead">Flows between steps, as bands</p>

Shows how an amount moves through steps and splits, for example where visitors came from and where they went, or where a budget goes. The width of each band is its amount. For one path that only gets narrower, use the [funnel](./funnel). For parts of one whole, use the [treemap](./treemap) or the [meter group](./meter-group).

<Demo title="Basic">
  <SankeyBasic />
  <template #code>

<<< ../demos/SankeyBasic.vue

  </template>
</Demo>

- `links` is a list of `{ source, target, value }`. A node is any id that a link names, so you need no list of nodes. A flow of 0 and a flow from a node to itself are left out.
- `nodes` is optional: `{ id, label, color }`. It sets the text, the color, and the order of the nodes in each column.
- Each node goes in the column of its longest path from a start. A node with no flow out goes in the last column, so all the results line up at the end.
- A node's height is the larger of its flow in and its flow out. Each band takes the color of its source, and a hover shows the flow.
- Colors go through the chart colors in order. Set `color` on a node to a token name or any CSS color. The labels and values are in the text color, so the chart is readable without color.
- The chart draws at the width of its container, measured in the browser, and `height` sets the height (default 320). Text is never stretched.
- The chart is hidden from screen readers, and a table of the flows (from, to, value) is read in its place. `label` names the table.
- `format` sets the text of a value. Change the column names with `labels` or a [label pack](../guide/translating): `from`, `to`, and `value`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessSankey, type BlessSankeyLink, type BlessSankeyNode } from "blessing-ui";
```

## API

<PropsTable name="BlessSankey" />

<script setup>
import SankeyBasic from "../demos/SankeyBasic.vue";
</script>
