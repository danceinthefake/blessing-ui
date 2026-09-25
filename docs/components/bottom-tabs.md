---
title: BottomTabs
---

<script setup>
import BottomTabsBasic from "../demos/BottomTabsBasic.vue";
</script>

# BottomTabs

<p class="bless-lead">Mobile bottom nav bar or floating dock</p>

The main sections of a phone-sized app, three to five of them, in reach of the thumb. On wide screens use a [SidebarNav](./sidebar-nav) or a top bar instead; for switching views inside one page, [Tabs](./tabs).
<Demo title="Basic">
<BottomTabsBasic />
<template #code>

<<< ../demos/BottomTabsBasic.vue

  </template>
</Demo>

- `bar` is fixed to the bottom and pads itself for the home indicator (`--bless-safe-bottom`); leave the same room at the bottom of the page so nothing hides under it. `dock` floats as an icon strip.
- `href` makes a tab a link (through your router, see [Install](/guide/install#with-a-router)); the active one has `aria-current="page"`.
- A badge is read with its tab ("Inbox, 3 new"); `badgeLabel` sets the word.

## Usage

```ts
import { BlessBottomTabs } from "blessing-ui";
```

## API

<PropsTable name="BlessBottomTabs" />
