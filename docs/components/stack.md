---
title: Stack
---

<script setup>
import StackBasic from "../demos/StackBasic.vue";
</script>

# Stack

<p class="bless-lead">Flex row / column with token gap</p>

Spacing children in a row or column with token gaps, so layouts don't need one-off margins. For a page grid use CSS grid; Stack is for small groups.
<Demo title="Basic">
<StackBasic />
<template #code>

<<< ../demos/StackBasic.vue

  </template>
</Demo>

- `direction` (column by default), `gap` (a space token: 1–16), `align`, `justify`, `wrap`.
- `as` sets the element — use `ul` with `li` children when it's really a list.

## Usage

```ts
import { BlessStack } from "blessing-ui";
```

## API

<PropsTable name="BlessStack" />
