---
title: PickList
---

<script setup>
import PickListBasic from "../demos/PickListBasic.vue";
</script>

# PickList

<p class="bless-lead">Two listboxes with transfer buttons</p>

Choosing a subset from a long list where both sides matter — the columns to show, the members of a group. For picking several from a short list, a multiple [Listbox](./listbox) or checkboxes are simpler; to reorder a single list, [OrderList](./order-list).
<Demo title="Basic">
<PickListBasic />
<template #code>

<<< ../demos/PickListBasic.vue

  </template>
</Demo>

- Select in either list (Space, or click), then move with the buttons between them. Buttons are named after the list they move to; after a move, focus goes to that list and the move is announced.
- `v-model:source` and `v-model:target` both update; `sourceLabel` / `targetLabel` name the lists.

## Usage

```ts
import { BlessPickList } from "blessing-ui";
```

## API

<PropsTable name="BlessPickList" />
