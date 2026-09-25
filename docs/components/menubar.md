---
title: Menubar
---

<script setup>
import MenubarBasic from "../demos/MenubarBasic.vue";
</script>

# Menubar

<p class="bless-lead">Bar of BlessDropdownMenus</p>

The File / Edit / View bar of a desktop-style app: a row of menus with commands. Site navigation is not a menubar; use [NavigationMenu](./navigation-menu) or [SidebarNav](./sidebar-nav) — links in a menubar are announced as commands.

<Demo title="Basic">
  <MenubarBasic />
  <template #code>

<<< ../demos/MenubarBasic.vue

  </template>
</Demo>

- Wrap [DropdownMenu](./dropdown-menu)s. The bar is one Tab stop: ← / → move between menus (and keep one open while you move), ↓ opens.
- Each trigger is told it opens a menu and whether it's open.
- `label` names the bar.

## Usage

```ts
import { BlessMenubar } from "blessing-ui";
```

## API

<PropsTable name="BlessMenubar" />
