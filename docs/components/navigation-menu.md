---
title: NavigationMenu
---

<script setup>
import NavigationMenuBasic from "../demos/NavigationMenuBasic.vue";
</script>

# NavigationMenu

<p class="bless-lead">Horizontal nav with panels</p>

A site's top navigation, where some entries open a panel of links. It's navigation, not commands: for an app's File / Edit menus use [Menubar](./menubar); on phones, [BottomTabs](./bottom-tabs) or a [Drawer](./drawer).
<Demo title="Basic">
<NavigationMenuBasic />
<template #code>

<<< ../demos/NavigationMenuBasic.vue

  </template>
</Demo>

- Entries with `items` open a panel: on hover with a mouse, on tap on touch screens, and with Enter, Space or ↓ from the keyboard (focus moves into the panel). ← / → move between entries.
- Esc closes the panel and returns focus to its entry; tabbing out of it closes it too.
- `active` marks the current section (`aria-current="page"`); `#panel` replaces the panel's links with your own layout.

## Usage

```ts
import { BlessNavigationMenu } from "blessing-ui";
```

## API

<PropsTable name="BlessNavigationMenu" />
