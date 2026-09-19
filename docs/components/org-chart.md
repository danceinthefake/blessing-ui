---
title: OrgChart
---

<script setup>
import OrgChartBasic from "../demos/OrgChartBasic.vue";
</script>

# OrgChart

<p class="bless-lead">Node tree with connectors</p>

<Demo title="Basic">
  <OrgChartBasic />
  <template #code>

<<< ../demos/OrgChartBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessOrgChart, BlessOrgChartNode } from "blessing-ui";
```

## API

### BlessOrgChart

<PropsTable name="BlessOrgChart" />

### BlessOrgChartNode

<PropsTable name="BlessOrgChartNode" />
