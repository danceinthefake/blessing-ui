---
title: Drawer
---

<script setup>
import DrawerBasic from "../demos/DrawerBasic.vue";
</script>

# Drawer

<p class="bless-lead">Bottom sheet with swipe-to-close</p>

A panel that slides up from the bottom on phones — filters, a share sheet, details for a map pin. On wide screens a [Sheet](./sheet) from the side or a [Modal](./modal) usually fits better.
<Demo title="Basic">
<DrawerBasic />
<template #code>

<<< ../demos/DrawerBasic.vue

  </template>
</Demo>

- A [Sheet](./sheet) from the bottom with a drag handle. Esc, the backdrop and the handle close it; `:dismissible="false"` keeps it open until your own button closes it.
- `title` (or `#title`) names it.

## Usage

```ts
import { BlessDrawer } from "blessing-ui";
```

## API

<PropsTable name="BlessDrawer" />
