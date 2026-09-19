---
title: Checkbox
---

<script setup>
import CheckboxArray from "../demos/CheckboxArray.vue";
import CheckboxBasic from "../demos/CheckboxBasic.vue";
</script>

# Checkbox

<p class="bless-lead">Native checkbox</p>

<Demo title="Array">
  <CheckboxArray />
  <template #code>

<<< ../demos/CheckboxArray.vue

  </template>
</Demo>

<Demo title="Basic">
  <CheckboxBasic />
  <template #code>

<<< ../demos/CheckboxBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessCheckbox } from "blessing-ui";
```

## API

<PropsTable name="BlessCheckbox" />
