---
title: ClientOnly
---

<script setup>
import ClientOnlyBasic from "../demos/ClientOnlyBasic.vue";
</script>

# ClientOnly

<p class="bless-lead">Render only in the browser</p>

<Demo title="Basic">
  <ClientOnlyBasic />
  <template #code>

<<< ../demos/ClientOnlyBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessClientOnly } from "blessing-ui";
```

## API

<PropsTable name="BlessClientOnly" />
