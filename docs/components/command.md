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

## When to use

A command palette — `⌘K` / `Ctrl+K` opens it, typing filters, arrows move, Enter runs. Items carry a `group`, optional `keywords` for fuzzy hits and a `shortcut` label. Use it for actions and navigation, not for picking values (that's `BlessCombobox`). `inline` renders the same list without the modal, for a settings page or a sidebar search.

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
