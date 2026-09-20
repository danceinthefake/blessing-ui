---
title: Combobox
---

<script setup>
import ComboboxBasic from "../demos/ComboboxBasic.vue";
</script>

# Combobox

<p class="bless-lead">Searchable select</p>

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
