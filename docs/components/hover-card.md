---
title: HoverCard
---

<script setup>
import HoverCardBasic from "../demos/HoverCardBasic.vue";
</script>

# HoverCard

<p class="bless-lead">Rich hover popover</p>

A preview shown while pointing at (or focusing) a link — a profile, a page summary. It is extra: touch screens can't hover, so nothing in it may be the only way to reach something.

<Demo title="Basic">
  <HoverCardBasic />
  <template #code>

<<< ../demos/HoverCardBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

- It opens after `openDelay` on hover or keyboard focus and closes after `closeDelay`, so the pointer can move into it.
- For content that must be reachable on every device, use a [Popover](./popover) opened by a click.

## Usage

```ts
import { BlessHoverCard } from "blessing-ui";
```

## API

<PropsTable name="BlessHoverCard" />
