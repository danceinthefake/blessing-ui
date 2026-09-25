---
title: InputMask
---

<script setup>
import InputMaskBasic from "../demos/InputMaskBasic.vue";
</script>

# InputMask

<p class="bless-lead">Pattern-masked input (# A *)</p>

For values with one fixed shape — a domestic phone number, a card number, a postcode, a product code. The literals appear as you type, anything that doesn't fit the next slot is dropped, and a paste is reformatted. For values whose length or shape varies (international phone numbers, emails), use [Input](./input) with `pattern` instead: a mask that is wrong for someone's value locks them out.

<Demo title="Basic">
  <InputMaskBasic />
  <template #code>

<<< ../demos/InputMaskBasic.vue

  </template>
</Demo>

- Tokens: `#` a digit, `A` a letter, `*` either. Anything else is a literal.
- `v-model` is the masked value (`090-1234-5678`), and that is what the form submits. `@update:raw` gives it with the literals stripped (`09012345678`).
- A mask with only `#` tokens sets `inputmode="numeric"`, so phones show the number pad; pass `inputmode` to override.
- The placeholder defaults to the mask with `_` in each slot.

## Usage

```ts
import { BlessInputMask } from "blessing-ui";
```

## API

<PropsTable name="BlessInputMask" />
