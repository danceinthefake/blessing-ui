---
title: Command
---

<script setup>
import CommandBasic from "../demos/CommandBasic.vue";
import CommandInline from "../demos/CommandInline.vue";
</script>

# Command

<p class="bless-lead">⌘K palette</p>

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

## Usage

```ts
import { BlessCommand } from "blessing-ui";
```

## API

<PropsTable name="BlessCommand" />
