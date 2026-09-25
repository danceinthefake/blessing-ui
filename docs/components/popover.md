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

Extra content next to the thing that opens it — a small form, details, a colour picker. For a one-line hint use a [Tooltip](./tooltip); for commands, a [DropdownMenu](./dropdown-menu).
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

- A click on the trigger opens it; the trigger is told what it opens and whether it's open. Esc or a click outside closes it, and focus goes back to the trigger if it was inside.
- `modal` turns off the click-outside close (Esc and your own control still close it). `trigger="hover"` opens on hover and focus, for previews only — see [HoverCard](./hover-card).
- `title` names it; `arrow` points its accent edge at the trigger.

## Usage

```ts
import { BlessPopover } from "blessing-ui";
```

## API

<PropsTable name="BlessPopover" />
