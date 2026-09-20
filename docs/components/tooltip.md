---
title: Tooltip
---

<script setup>
import TooltipBasic from "../demos/TooltipBasic.vue";
</script>

# Tooltip

<p class="bless-lead">Hover/focus tip</p>

<Demo title="Basic">
  <TooltipBasic />
  <template #code>

<<< ../demos/TooltipBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessTooltip } from "blessing-ui";
```

## API

<PropsTable name="BlessTooltip" />
