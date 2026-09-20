---
title: Popover
---

<script setup>
import PopoverBasic from "../demos/PopoverBasic.vue";
import PopoverManual from "../demos/PopoverManual.vue";
import PopoverArrow from "../demos/PopoverArrow.vue";
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

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

<Demo title="Arrow">
  <PopoverArrow />
  <template #code>

<<< ../demos/PopoverArrow.vue

  </template>
</Demo>

## Usage

```ts
import { BlessPopover } from "blessing-ui";
```

## API

<PropsTable name="BlessPopover" />
