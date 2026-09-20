---
title: ConfirmPopup
---

<script setup>
import ConfirmPopupBasic from "../demos/ConfirmPopupBasic.vue";
</script>

# ConfirmPopup

<p class="bless-lead">Confirm inside a popover</p>

<Demo title="Basic">
  <ConfirmPopupBasic />
  <template #code>

<<< ../demos/ConfirmPopupBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessConfirmPopup } from "blessing-ui";
```

## API

<PropsTable name="BlessConfirmPopup" />
