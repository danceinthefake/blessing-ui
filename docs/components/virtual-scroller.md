---
title: VirtualScroller
---

<script setup>
import VirtualScrollerBasic from "../demos/VirtualScrollerBasic.vue";
import VirtualScrollerDynamic from "../demos/VirtualScrollerDynamic.vue";
</script>

# VirtualScroller

<p class="bless-lead">Windowed list for long data</p>

<Demo title="Basic">
  <VirtualScrollerBasic />
  <template #code>

<<< ../demos/VirtualScrollerBasic.vue

  </template>
</Demo>

<Demo title="Dynamic heights">
  <VirtualScrollerDynamic />
  <template #code>

<<< ../demos/VirtualScrollerDynamic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessVirtualScroller } from "blessing-ui";
```

## API

<PropsTable name="BlessVirtualScroller" />
