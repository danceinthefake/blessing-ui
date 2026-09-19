---
title: Form
---

<script setup>
import FormBasic from "../demos/FormBasic.vue";
</script>

# Form

<p class="bless-lead">Constraint-API form + field wiring</p>

<Demo title="Basic">
  <FormBasic />
  <template #code>

<<< ../demos/FormBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessForm, BlessField } from "blessing-ui";
```

## API

### BlessForm

<PropsTable name="BlessForm" />

### BlessField

<PropsTable name="BlessField" />
