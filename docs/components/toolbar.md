---
title: Toolbar
---

<script setup>
import ToolbarBasic from "../demos/ToolbarBasic.vue";
</script>

# Toolbar

<p class="bless-lead">Start / center / end bar</p>

A row of related controls — formatting buttons, view switches, a filter bar — with start, centre and end slots. It is one Tab stop: arrow keys move between its controls, which keeps a long row from swallowing the Tab key.

<Demo title="Basic">
  <ToolbarBasic />
  <template #code>

<<< ../demos/ToolbarBasic.vue

  </template>
</Demo>

- ← / → move between controls, Home / End jump, and right-to-left pages reverse the arrows. Give it a `label` so the group has a name.
- For a single row of buttons that belong together visually but aren't a tool set, [ButtonGroup](./button-group).

## Usage

```ts
import { BlessToolbar } from "blessing-ui";
```

## API

<PropsTable name="BlessToolbar" />
