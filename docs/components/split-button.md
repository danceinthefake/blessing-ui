---
title: SplitButton
---

<script setup>
import SplitButtonBasic from "../demos/SplitButtonBasic.vue";
</script>

# SplitButton

<p class="bless-lead">Button with a menu half</p>

One main action with related variants a click away — Save / Save as…, Merge / Squash. If the choices are equal, use a [DropdownMenu](./dropdown-menu) or separate buttons.
<Demo title="Basic">
<SplitButtonBasic />
<template #code>

<<< ../demos/SplitButtonBasic.vue

  </template>
</Demo>

- The main part fires `@click`; the arrow opens the menu (`items`, `@select`) and is named by `menuLabel`.
- `color`, `variant`, `size`, `disabled` and `loading` apply to both halves.

## Usage

```ts
import { BlessSplitButton } from "blessing-ui";
```

## API

<PropsTable name="BlessSplitButton" />
