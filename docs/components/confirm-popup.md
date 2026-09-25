---
title: ConfirmPopup
---

<script setup>
import ConfirmPopupBasic from "../demos/ConfirmPopupBasic.vue";
</script>

# ConfirmPopup

<p class="bless-lead">Confirm inside a popover</p>

A quick "are you sure?" next to the button that asked — remove a row, archive. For something serious or irreversible, where the whole page should stop, use an [AlertDialog](./alert-dialog).
<Demo title="Basic">
<ConfirmPopupBasic />
<template #code>

<<< ../demos/ConfirmPopupBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

- Opening moves focus to Cancel, the safe choice; confirming or cancelling returns it to the trigger.
- `@confirm` / `@cancel`; name the action in `confirmLabel` ("Remove", not "OK").

## Usage

```ts
import { BlessConfirmPopup } from "blessing-ui";
```

## API

<PropsTable name="BlessConfirmPopup" />
