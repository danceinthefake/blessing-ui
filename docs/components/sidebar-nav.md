---
title: SidebarNav
---

<script setup>
import SidebarNavBasic from "../demos/SidebarNavBasic.vue";
</script>

# SidebarNav

<p class="bless-lead">Vertical nav list</p>

A site's section list down the side — the pages of a manual, the sections of an official site. On phones it usually moves into a [Drawer](./drawer).

<Demo title="Basic">
  <SidebarNavBasic />
  <template #code>

<<< ../demos/SidebarNavBasic.vue

  </template>
</Demo>

- Links go through your router when one is provided; `active` marks the current page (`aria-current="page"`); `external` keeps a link a plain `<a>`.
- `meta` adds a dated line after a dash; `badge: true` shows NEW!.

## Usage

```ts
import { BlessSidebarNav } from "blessing-ui";
```

## API

<PropsTable name="BlessSidebarNav" />
