---
title: Funnel
---

<script setup>
import FunnelBasic from "../demos/FunnelBasic.vue";
</script>

# Funnel

<p class="bless-lead">Stages with the share that is left at each step</p>

The steps that people take toward a goal, and how many are left at each step. Use it for a sign-up, a checkout, or an adoption path. For parts of one whole, use [Treemap](./treemap). For a flow with branches, see the Sankey demo on the [Chart](./chart) page.

<Demo title="Basic">
  <FunnelBasic />
  <template #code>

<<< ../demos/FunnelBasic.vue

  </template>
</Demo>

- `stages` run from the widest to the narrowest. Each bar is as wide as the stage compared with the first stage. A very small stage keeps a bar of at least 2%, so you can see it.
- Each row also says the rates as text: the share of the first stage, and the share of the stage before. A screen reader hears the same numbers as the picture shows.
- `format` writes a value, for example with `toLocaleString`. `labels` replaces the English rate words. `color` is a token name or any CSS color.
- The funnel is an ordered list named by `label`.

## Usage

```ts
import { BlessFunnel } from "blessing-ui";
```

## API

<PropsTable name="BlessFunnel" />
