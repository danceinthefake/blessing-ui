---
title: Modal
---

<script setup>
import ModalBasic from "../demos/ModalBasic.vue";
import ModalHash from "../demos/ModalHash.vue";
</script>

# Modal

<p class="bless-lead">Native &lt;dialog&gt;</p>

A task that needs the attention of the whole screen before the user goes back: a form, a detail view, a picker. If it only needs a yes / no, use an [AlertDialog](./alert-dialog). If the page must stay usable beside it, use a [Sheet](./sheet).

<Demo title="Basic">
  <ModalBasic />
  <template #code>

<<< ../demos/ModalBasic.vue

  </template>
</Demo>

<Demo title="Hash">
  <ModalHash />
  <template #code>

<<< ../demos/ModalHash.vue

  </template>
</Demo>

- A native `<dialog>`: the page behind is inert, Tab stays inside, Esc closes it, and focus returns to what opened it. It is named by its `title`.
- `dismissible` (default) also closes it on a backdrop click. `hash` ties it to the URL, so a link can open it and Back closes it.

## Usage

```ts
import { BlessModal } from "blessing-ui";
```

## API

<PropsTable name="BlessModal" />
