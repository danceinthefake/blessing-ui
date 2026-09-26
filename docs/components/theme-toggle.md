---
title: ThemeToggle
---

<script setup>
import ThemeToggleBasic from "../demos/ThemeToggleBasic.vue";
</script>

# ThemeToggle

<p class="bless-lead">Light/dark switch or 3-way group</p>

The control for [dark mode](../guide/dark-mode). Default is a single button — "Dark theme", `aria-pressed` when it's on — for a nav bar; `mode="group"` is light / system / dark as a toggle group, for a settings page. The switch can only ever set light or dark, so once pressed it leaves _system_ behind; offer the group where you want the OS to stay in charge. `labels` translates the names (`{ light, system, dark }`; the switch reads `dark`).

Its pressed state depends on the OS preference, which the server can't know, so it renders unpressed until mounted and server and client markup agree. To avoid the one-frame default before a saved theme applies, add the head script from the guide.

<Demo title="Basic">
  <ThemeToggleBasic />
  <template #code>

<<< ../demos/ThemeToggleBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessThemeToggle } from "blessing-ui";
```

## API

<PropsTable name="BlessThemeToggle" />
