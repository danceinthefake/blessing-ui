---
title: ContextMenu
---

<script setup>
import ContextMenuBasic from "../demos/ContextMenuBasic.vue";
</script>

# ContextMenu

<p class="bless-lead">Menu on right click</p>

Right-click commands for an area — a file in a list, a canvas. Everything in it must also be reachable another way (a toolbar, a ⋯ button): touch screens and many keyboard users never open a context menu.
<Demo title="Basic">
<ContextMenuBasic />
<template #code>

<<< ../demos/ContextMenuBasic.vue

  </template>
</Demo>

- It opens where you right-click, or at the focused element when opened with the Menu key or Shift+F10.
- The menu itself is a [DropdownMenu](./dropdown-menu): arrows, typeahead, checkbox and radio items, submenus.

## Usage

```ts
import { BlessContextMenu } from "blessing-ui";
```

## API

<PropsTable name="BlessContextMenu" />
