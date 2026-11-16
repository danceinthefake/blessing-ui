---
title: Chord diagram
---

<script setup>
import ChordDiagramBasic from "../demos/ChordDiagramBasic.vue";
</script>

# Chord diagram

<p class="bless-lead">Groups around a circle, with ribbons for the flows between them</p>

Shows flows in both directions between a few groups, for example the listeners who move from one show to another. For flows in one direction through steps, use the [Sankey chart](./sankey).

<Demo title="Basic">
  <ChordDiagramBasic />
  <template #code>

<<< ../demos/ChordDiagramBasic.vue

  </template>
</Demo>

- `groups` is a list of groups, each with a `key`, a `label`, and an optional `color`.
- `matrix` is a square grid in the order of the groups. `matrix[i][j]` is the flow from group i to group j.
- The arc of a group follows the sum of its row. Each ribbon joins two groups. Its width at each end is the flow out of that end, and its color is the color of the bigger flow.
- A hover on a ribbon makes the others faint and shows the flows both ways. `size` sets the width of the chart (default 320), and `format` sets the text of a value.
- Keep to about eight groups, so that the labels and the ribbons stay easy to read.
- For screen readers, the chart is a table of the full matrix. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `from`, and `to` (a function of the name).

## Usage

```ts
import { BlessChordDiagram } from "blessing-ui";
```

## API

<PropsTable name="BlessChordDiagram" />
