---
title: CascadeSelect
---

<script setup>
import CascadeSelectBasic from "../demos/CascadeSelectBasic.vue";
</script>

# CascadeSelect

<p class="bless-lead">Nested options, one column per level</p>

## When to use

For values that live in a hierarchy — country → city → area, category → subcategory — where a flat select would be hundreds of entries. Each level opens as its own column, so the user always sees where they are; the trigger shows the full path or just the leaf.

If the hierarchy is deep or ragged, `BlessTreeSelect` (a tree in a popover) is usually the better fit. If the options are flat but many, `BlessCombobox`.

The model is the leaf's value; `select` emits `(option, path)` with the whole trail when you need the parents too. Keyboard: ↑ / ↓ move in a column, → drills into children, ← backs out (both follow reading direction in RTL), Enter picks, Esc closes. Inside a `BlessField` the trigger takes the field's label; `label` is only for a select with no visible label.

<Demo title="Basic">
  <CascadeSelectBasic />
  <template #code>

<<< ../demos/CascadeSelectBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessCascadeSelect } from "blessing-ui";
```

## API

<PropsTable name="BlessCascadeSelect" />
