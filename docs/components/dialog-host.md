---
title: DialogHost
---

<script setup>
import DialogHostBasic from "../demos/DialogHostBasic.vue";
</script>

# DialogHost

<p class="bless-lead">Programmatic modals via useDialog()</p>

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

The component gets your `props` plus a `close(result)` prop; `open()` resolves with that result, or `undefined` when dismissed. Mount `<BlessDialogHost />` once, at the app root.

## Usage

```ts
import { BlessDialogHost } from "blessing-ui";
```

## API

<PropsTable name="BlessDialogHost" />
