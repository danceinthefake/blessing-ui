---
title: Combobox
---

<script setup>
import ComboboxBasic from "../demos/ComboboxBasic.vue";
</script>

# Combobox

<p class="bless-lead">Searchable select</p>

## When to use

A text field that searches a list as you type — the right control when a `BlessSelect` would have more options than a person can scan. `multiple` turns picks into removable chips; `creatable` lets the user add an option that isn't there yet and emits `create` so you can persist it.

For a handful of options use `BlessSelect` (native, no JS). For commands rather than values, use `BlessCommand`.

Filtering is client-side over `options`. For server-side search, listen to `search` (the query as typed) and bind `options` to what comes back — the list re-renders, nothing else changes. Keyboard: ↑ / ↓ move, Enter picks (or creates), Esc closes, and in `multiple` mode Backspace on an empty query removes the last chip. Inside a `BlessField` the field's label names the input; `label` is for a combobox with no visible label.

<Demo title="Basic">
  <ComboboxBasic />
  <template #code>

<<< ../demos/ComboboxBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessCombobox } from "blessing-ui";
```

## API

<PropsTable name="BlessCombobox" />
