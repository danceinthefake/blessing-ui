---
title: Modal
---

<script setup>
import ModalBasic from "../demos/ModalBasic.vue";
import ModalHash from "../demos/ModalHash.vue";
</script>

# Modal

<p class="bless-lead">Native &lt;dialog&gt;</p>

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

## Usage

```ts
import { BlessModal } from "blessing-ui";
```

## API

<PropsTable name="BlessModal" />
