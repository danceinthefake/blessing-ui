---
title: Command
---

<script setup>
import CommandBasic from "../demos/CommandBasic.vue";
import CommandInline from "../demos/CommandInline.vue";
import CommandScoped from "../demos/CommandScoped.vue";
</script>

# Command

<p class="bless-lead">⌘K palette</p>

A search-and-run palette for apps with many commands — ⌘K to open, type, Enter. It helps people who know what they want; it doesn't replace visible navigation.

Use it for actions and navigation, not for picking values (that's [Combobox](./combobox)). Items carry a `group`, optional `keywords` and a `shortcut` label.

<Demo title="Basic">
  <CommandBasic />
  <template #code>

<<< ../demos/CommandBasic.vue

  </template>
</Demo>

<Demo title="Inline">
  <CommandInline />
  <template #code>

<<< ../demos/CommandInline.vue

  </template>
</Demo>

<Demo title="Recent and scoped">
  <CommandScoped />
  <template #code>

<<< ../demos/CommandScoped.vue

  </template>
</Demo>

- ⌘K / Ctrl+K opens it (`hotkey`), except inside rich-text editors, where that key already inserts a link.
- The input is a combobox over the result list: ↑ / ↓ move, Enter runs, Home / End jump. Groups (`group`) are labelled; "No results" is announced.
- **Recent** (`recent`): while the search is empty the items chosen before come first, newest first, in a "Recent" group (`recentLimit`, default 5). Items that are gone or disabled are left out. `v-model:history` is the list of values if you want to keep it; `persist="app"` saves it in `localStorage` under that key, read after mount.
- **Scopes** (`:scopes="[{ key: '@', group: 'People' }]"`): typing a scope's key first narrows the search to that `group` — a chip shows it ("People ×"), Backspace on an empty search or a click on the chip leaves it, and a hint under the box lists the keys. A key typed anywhere else is plain text. The input's name gains "Only in People", so it is spoken.
- `labels` translates "Recent", the chip and the hint.
- `keywords` add search terms; `filter` replaces matching; `inline` renders it in the page instead of a modal.

## Usage

```ts
import { BlessCommand } from "blessing-ui";
```

## API

<PropsTable name="BlessCommand" />
