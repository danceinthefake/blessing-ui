---
title: Venn
---

<script setup>
import VennBasic from "../demos/VennBasic.vue";
</script>

# Venn

<p class="bless-lead">Two or three circles that overlap, with the count in each part</p>

Shows how groups share members, for example the people who follow a show in more than one place. For parts of one whole, use the [waffle](./waffle).

<Demo title="Basic">
  <VennBasic />
  <template #code>

<<< ../demos/VennBasic.vue

  </template>
</Demo>

- `sets` is a list of two or three sets. Each set has a `key`, a `label`, a `size`, and an optional `color`. The size is the whole set, with the parts it shares.
- `overlaps` gives the size of each pair, such as `{ keys: ["pod", "yt"], size: 14 }`, and of all three sets. The size of a pair includes the part that all three share.
- Each part of the drawing shows how many are in that part only. The chart works these counts out from the sizes, by inclusion and exclusion.
- The circles have a fixed size and place, so the areas do not show the counts. The numbers do.
- The legend names the sets with their sizes. `format` sets the text of a count.
- For screen readers, the chart is a table with a row for each part, such as "Only YouTube" or "Podcast apps and YouTube". `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `part`, `count`, `only` (a function of the name), and `and` (a function of the names).

## Usage

```ts
import { BlessVenn } from "blessing-ui";
```

## API

<PropsTable name="BlessVenn" />
