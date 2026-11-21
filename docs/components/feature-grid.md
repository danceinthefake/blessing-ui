---
title: Feature grid
---

# Feature grid

<p class="bless-lead">The features of a product with an icon, a title, and a short text each</p>

Tells visitors of a landing page what a product does, in short blocks that are easy to scan.

<Demo title="Basic">
  <FeatureGridBasic />
  <template #code>

<<< ../demos/FeatureGridBasic.vue

  </template>
</Demo>

- `features` is the list. Each feature has a `title`, a `text`, and an optional `href` that makes the title a link.
- The `icon` slot gets each feature and its index. The icon sits in an accent square and is hidden from screen readers, because the title says the same.
- `columns` is the most columns on a wide screen (default 3). On a narrow screen, the grid has fewer columns, and each block is 14 rem wide at least.
- Each title is a heading of level 3.

## Usage

```ts
import { BlessFeatureGrid } from "blessing-ui";
```

## API

<PropsTable name="BlessFeatureGrid" />

<script setup>
import FeatureGridBasic from "../demos/FeatureGridBasic.vue";
</script>
