---
title: Toaster
---

<script setup>
import ToasterBasic from "../demos/ToasterBasic.vue";
</script>

# Toaster

<p class="bless-lead">Notifications</p>

Short confirmations that come and go — saved, copied, sent. Nothing only in a toast should be needed later; errors people must act on belong in the page or an [Alert](./alert).
<Demo title="Basic">
<ToasterBasic />
<template #code>

<<< ../demos/ToasterBasic.vue

  </template>
</Demo>

- Mount one BlessToaster; call `useToast()` anywhere. Toasts are announced politely; `danger` ones interrupt.
- Timers pause while the pointer or keyboard focus is in the toaster, so an action button doesn't vanish mid-reach; `duration: 0` keeps one until dismissed.
- `action` adds one button; `position` picks the corner; `label` names the region.

## Usage

```ts
import { BlessToaster } from "blessing-ui";
```

## API

<PropsTable name="BlessToaster" />
