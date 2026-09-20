---
title: HoverCard
---

<script setup>
import HoverCardBasic from "../demos/HoverCardBasic.vue";
</script>

# HoverCard

<p class="bless-lead">Rich hover popover</p>

<Demo title="Basic">
  <HoverCardBasic />
  <template #code>

<<< ../demos/HoverCardBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessHoverCard } from "blessing-ui";
```

## API

<PropsTable name="BlessHoverCard" />
