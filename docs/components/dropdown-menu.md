---
title: DropdownMenu
---

<script setup>
import DropdownMenuBasic from "../demos/DropdownMenuBasic.vue";
</script>

# DropdownMenu

<p class="bless-lead">ARIA menu</p>

<Demo title="Basic">
  <DropdownMenuBasic />
  <template #code>

<<< ../demos/DropdownMenuBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessDropdownMenu } from "blessing-ui";
```

## API

<PropsTable name="BlessDropdownMenu" />
