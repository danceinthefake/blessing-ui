---
title: Command
---

<script setup>
import CommandBasic from "../demos/CommandBasic.vue";
import CommandInline from "../demos/CommandInline.vue";
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

- ⌘K / Ctrl+K opens it (`hotkey`), except inside rich-text editors, where that key already inserts a link.
- The input is a combobox over the result list: ↑ / ↓ move, Enter runs, Home / End jump. Groups (`group`) are labelled; "No results" is announced.
- `keywords` add search terms; `filter` replaces matching; `inline` renders it in the page instead of a modal.

## Usage

```ts
import { BlessCommand } from "blessing-ui";
```

## API

<PropsTable name="BlessCommand" />
