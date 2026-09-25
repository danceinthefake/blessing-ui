---
title: DropdownMenu
---

<script setup>
import DropdownMenuBasic from "../demos/DropdownMenuBasic.vue";
</script>

# DropdownMenu

<p class="bless-lead">ARIA menu</p>

Commands behind a button — row actions, a ⋯ menu, a user menu. For choosing a value use [Select](./select); for navigation, links.

<Demo title="Basic">
  <DropdownMenuBasic />
  <template #code>

<<< ../demos/DropdownMenuBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

- The trigger is your own button; it is told it opens a menu and whether it's open. ↓ / Enter / Space open it and focus the first item (↑ the last).
- Arrows, Home / End and typeahead move; Enter selects; Esc closes and returns to the trigger; Tab out closes it.
- Items can be checkboxes (`v-model:checked`), radio groups (`v-model:radios`), separators, labels and submenus. Inside a [Menubar](./menubar), ← / → move between menus.

## Usage

```ts
import { BlessDropdownMenu } from "blessing-ui";
```

## API

<PropsTable name="BlessDropdownMenu" />
