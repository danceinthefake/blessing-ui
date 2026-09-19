---
title: Tabs
---

<script setup>
import TabsBasic from "../demos/TabsBasic.vue";
import TabsManual from "../demos/TabsManual.vue";
</script>

# Tabs

<p class="bless-lead">ARIA tablist</p>

<Demo title="Basic">
  <TabsBasic />
  <template #code>

<<< ../demos/TabsBasic.vue

  </template>
</Demo>

<Demo title="Manual">
  <TabsManual />
  <template #code>

<<< ../demos/TabsManual.vue

  </template>
</Demo>

## Usage

```ts
import { BlessTabs } from "blessing-ui";
```

## API

<PropsTable name="BlessTabs" />
