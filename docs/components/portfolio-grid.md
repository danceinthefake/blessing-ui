---
title: Portfolio grid
---

<script setup>
import PortfolioGridBasic from "../demos/PortfolioGridBasic.vue";
</script>

# Portfolio grid

<p class="bless-lead">Work in a grid with filter buttons by kind</p>

Shows the work of a studio, a designer, or a photographer, so visitors can find the kind of work they need.

<Demo title="Basic">
  <PortfolioGridBasic />
  <template #code>

<<< ../demos/PortfolioGridBasic.vue

  </template>
</Demo>

- `works` is the list. Each work has an `id`, a `title`, a `kind`, an `image`, and optional `image-alt`, `href`, and `year`.
- The filter buttons come from the kinds in the list, after "All". The pressed button shows in dark and has `aria-pressed`.
- `v-model:filter` holds the kind to show. An empty string shows all.
- A status line says how many works show, and screen readers hear it when the filter changes.
- A work with `href` is a link around the image and the title.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessPortfolioGrid } from "blessing-ui";
```

## API

<PropsTable name="BlessPortfolioGrid" />
