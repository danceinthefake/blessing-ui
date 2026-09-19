---
title: Button
---

<script setup>
import ButtonBasic from "../demos/ButtonBasic.vue";
import ButtonSizes from "../demos/ButtonSizes.vue";
import ButtonStates from "../demos/ButtonStates.vue";
</script>

# Button

<p class="bless-lead">Button or anchor</p>

<Demo title="Basic">
  <ButtonBasic />
  <template #code>

<<< ../demos/ButtonBasic.vue

  </template>
</Demo>

<Demo title="Sizes">
  <ButtonSizes />
  <template #code>

<<< ../demos/ButtonSizes.vue

  </template>
</Demo>

<Demo title="States">
  <ButtonStates />
  <template #code>

<<< ../demos/ButtonStates.vue

  </template>
</Demo>

## Usage

```ts
import { BlessButton } from "blessing-ui";
```

## API

<PropsTable name="BlessButton" />
