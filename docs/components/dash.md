---
title: Dash
---

<script setup>
import DashBasic from "../demos/DashBasic.vue";
</script>

# Dash

<p class="bless-lead">Inline 10×1px separator</p>

The source site's news line: `2019.04.04 — Blu-ray BOX` — a date, a short rule, a title. `BlessDash` is that rule: `--bless-dash-width` (10px) by `--bless-border-width` (1px), sitting on the text baseline with 8px either side. `BlessListItem` and `BlessSidebarNav` insert one before `meta` and `badge` for you.

It is decoration with one job for screen readers: it holds a zero-size space, so `2019.04.04<BlessDash />Blu-ray BOX` reads as two words without a space in your markup. Ink by default, `muted` for quieter lines — like every rule, it never takes the accent at rest. It separates words on a line; a rule between blocks is [Separator](./separator).

<Demo title="Basic">
  <DashBasic />
  <template #code>

<<< ../demos/DashBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessDash } from "blessing-ui";
```

## API

<PropsTable name="BlessDash" />
