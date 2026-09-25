---
title: AlertDialog
---

<script setup>
import AlertDialogBasic from "../demos/AlertDialogBasic.vue";
</script>

# AlertDialog

<p class="bless-lead">Confirm dialog</p>

A question that must be answered before going on, usually before something that can't be undone — delete, discard, leave. For information that needs no answer, use a [Toast](./toaster) or an [Alert](./alert); for a quick confirm next to the button, [ConfirmPopup](./confirm-popup).
<Demo title="Basic">
<AlertDialogBasic />
<template #code>

<<< ../demos/AlertDialogBasic.vue

  </template>
</Demo>

- It is read as an alert dialog with its title and `description`. Focus starts on Cancel, the safe choice; Esc also cancels.
- Clicking outside doesn't close it. `@confirm` and `@cancel` say which way it went; `loading` holds the confirm button while you work.
- Name the action in the button (`confirmLabel="Delete"`), not "OK".

## Usage

```ts
import { BlessAlertDialog } from "blessing-ui";
```

## API

<PropsTable name="BlessAlertDialog" />
