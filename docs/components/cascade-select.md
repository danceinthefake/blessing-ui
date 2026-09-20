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
