---
title: Form
---

<script setup>
import FormBasic from "../demos/FormBasic.vue";
</script>

# Form

<p class="bless-lead">Constraint-API form + field wiring</p>

`BlessField` hands its label's `for` id to the first control inside it, so `<BlessField label="Name"><BlessInput /></BlessField>` is already associated. The slot props (`id`, `error`, `describedby`) are for when you need more than one control in a field or the error wiring, as below.

<Demo title="Basic">
  <FormBasic />
  <template #code>

<<< ../demos/FormBasic.vue

  </template>
</Demo>

`BlessField` hands its label's `for` id to the first control inside it, so `<BlessField label="Name"><BlessInput /></BlessField>` is already associated; the slot props (`id`, `error`, `describedby`) are there for when you need more than one control or the error wiring.

## Usage

```ts
import { BlessForm, BlessField } from "blessing-ui";
```

## API

### BlessForm

<PropsTable name="BlessForm" />

### BlessField

<PropsTable name="BlessField" />
