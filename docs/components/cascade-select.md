---
title: CascadeSelect
---

<script setup>
import CascadeSelectBasic from "../demos/CascadeSelectBasic.vue";
</script>

# CascadeSelect

<p class="bless-lead">Nested options, one column per level</p>

<Demo title="Basic">
  <CascadeSelectBasic />
  <template #code>

<<< ../demos/CascadeSelectBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessCascadeSelect } from "blessing-ui";
```

## API

<PropsTable name="BlessCascadeSelect" />
