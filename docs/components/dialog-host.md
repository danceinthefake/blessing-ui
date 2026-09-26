---
title: DialogHost
---

<script setup>
import DialogHostBasic from "../demos/DialogHostBasic.vue";
</script>

# DialogHost

<p class="bless-lead">Programmatic modals via useDialog()</p>

Renders dialogs opened from code with `useDialog()` — a confirm from a store action, a form in a modal without a component in the template. Mount one per app, near the root.

<Demo title="Basic">
  <DialogHostBasic />
  <template #code>

<<< ../demos/DialogHostBasic.vue

  </template>
</Demo>

## useDialog()

```ts
const { open, close } = useDialog();
const result = await open<string>({ title, component, props, size, dismissible });
const ok = await open({ title, text: "plain body" });
```

The component gets your `props` plus a `close(result)` prop; `open()` resolves with that result, or `undefined` when dismissed.

- Each dialog is a [Modal](./modal), with its focus handling and Esc.

## Usage

```ts
import { BlessDialogHost } from "blessing-ui";
```

## API

<PropsTable name="BlessDialogHost" />
