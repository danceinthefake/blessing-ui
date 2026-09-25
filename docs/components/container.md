---
title: Container
---

<script setup>
import ContainerBasic from "../demos/ContainerBasic.vue";
</script>

# Container

<p class="bless-lead">Centred max-width box</p>

Caps the width of a page's content and centres it, so lines stay readable on wide screens. One per page region; it doesn't lay anything out inside.
<Demo title="Basic">
<ContainerBasic />
<template #code>

<<< ../demos/ContainerBasic.vue

  </template>
</Demo>

- `size`: `sm`, `md`, `lg` (default) or `full`. `padded` (default) keeps side gutters, including the safe area on notched phones.
- `as` sets the element (`main`, `section`…).

## Usage

```ts
import { BlessContainer } from "blessing-ui";
```

## API

<PropsTable name="BlessContainer" />
