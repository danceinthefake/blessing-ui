---
title: Chart
---

<script setup>
import ChartBars from "../demos/ChartBars.vue";
import ChartBasic from "../demos/ChartBasic.vue";
</script>

# Chart

<p class="bless-lead">Themed frame for any [Unovis](https://unovis.dev) chart</p>

<Demo title="Bars">
  <ChartBars />
  <template #code>

<<< ../demos/ChartBars.vue

  </template>
</Demo>

<Demo title="Basic">
  <ChartBasic />
  <template #code>

<<< ../demos/ChartBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessChart } from "blessing-ui";
```

## API

<PropsTable name="BlessChart" />
