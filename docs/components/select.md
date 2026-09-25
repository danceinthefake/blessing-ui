---
title: Select
---

<script setup>
import SelectBasic from "../demos/SelectBasic.vue";
</script>

# Select

<p class="bless-lead">Styled native &lt;select&gt;</p>

One choice from a list too long for radios. It is the native `<select>`, so phones show their own picker and every keyboard and screen reader already knows it. To type and filter a long list, use [Combobox](./combobox); to keep the options visible, [Listbox](./listbox).
<Demo title="Basic">
<SelectBasic />
<template #code>

<<< ../demos/SelectBasic.vue

  </template>
</Demo>

- `placeholder` shows until something is picked and reads as `undefined`; with `required`, an unpicked select fails validation as it should.
- Options can be grouped: `{ label, options: [...] }` becomes an `<optgroup>`.
- On Chrome 135+ the open list is styled too (`appearance: base-select`); elsewhere the browser's own list opens.

## Usage

```ts
import { BlessSelect } from "blessing-ui";
```

## API

<PropsTable name="BlessSelect" />
