---
title: OrgChart
---

<script setup>
import OrgChartBasic from "../demos/OrgChartBasic.vue";
</script>

# OrgChart

<p class="bless-lead">Node tree with connectors</p>

Who reports to whom, drawn top-down — a team, a cast and crew, a small hierarchy that fits on screen. For a deep or wide hierarchy people browse and expand, use [Tree](./tree).

<Demo title="Basic">
  <OrgChartBasic />
  <template #code>

<<< ../demos/OrgChartBasic.vue

  </template>
</Demo>

- Nested lists of buttons: the nesting carries the hierarchy, each person is one Tab stop, and the picked one is pressed (`v-model:selected`).
- `#node` renders a node yourself with `{ node, selected }`.

## Usage

```ts
import { BlessOrgChart, BlessOrgChartNode } from "blessing-ui";
```

## API

### BlessOrgChart

<PropsTable name="BlessOrgChart" />

### BlessOrgChartNode

<PropsTable name="BlessOrgChartNode" />
