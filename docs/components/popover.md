---
title: Popover
---

<script setup>
import PopoverBasic from "../demos/PopoverBasic.vue";
import PopoverManual from "../demos/PopoverManual.vue";
</script>

# Popover

<p class="bless-lead">Popover API panel</p>

<Demo title="Basic">
  <PopoverBasic />
  <template #code>

<<< ../demos/PopoverBasic.vue

  </template>
</Demo>

<Demo title="Manual">
  <PopoverManual />
  <template #code>

<<< ../demos/PopoverManual.vue

  </template>
</Demo>

## Usage

```ts
import { BlessPopover } from "blessing-ui";
```

## API

<PropsTable name="BlessPopover" />
