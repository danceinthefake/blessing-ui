---
title: DropdownMenu
---

<script setup>
import DropdownMenuBasic from "../demos/DropdownMenuBasic.vue";
</script>

# DropdownMenu

<p class="bless-lead">ARIA menu</p>

Commands behind a button: row actions, a ⋯ menu, a user menu. For choosing a value use [Select](./select). For navigation, links.

<Demo title="Basic">
  <DropdownMenuBasic />
  <template #code>

<<< ../demos/DropdownMenuBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` at a `<div>`. For this reason, a trigger placed inside a paragraph renders differently on the server and the client. Wrap it in a `<span>` or `<div>` instead.
:::

- The trigger is your own button. It is told it opens a menu and whether it is open. ↓ / Enter / Space open it and focus the first item (↑ the last).
- Arrows, Home / End and typeahead move. Enter selects. Esc closes and returns to the trigger. Tab out closes it.
- Items can be checkboxes (`v-model:checked`), radio groups (`v-model:radios`), separators, labels and submenus. Inside a [Menubar](./menubar), ← / → move between menus.

## Usage

```ts
import { BlessDropdownMenu } from "blessing-ui";
```

## API

<PropsTable name="BlessDropdownMenu" />
