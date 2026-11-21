---
title: Coupon input
---

# Coupon input

<p class="bless-lead">A field for a code, then the saving with a button to remove it</p>

Lets a person type a discount code at checkout. Your server checks the code. If the server takes it, the field changes to a chip with the code and the saving. Use it with the [order summary](./order-summary).

<Demo title="Basic">
  <CouponInputBasic />
  <template #code>

<<< ../demos/CouponInputBasic.vue

  </template>
</Demo>

- "Apply" or Enter emits `apply` with the code. With `uppercase` (on by default), the code is in capital letters. Check the code on your server.
- While the server checks, set `loading`. The button shows a spinner, and a second apply does not go out.
- If the server takes the code, set `applied` to `{ code, saving }`. The field changes to a chip, and a hidden status line says that the code is applied. The remove button on the chip emits `remove` with the code.
- If the server does not take the code, set `error` to the reason. The field shows it under the field and marks the field as not valid.
- Change the words with `labels` or a [label pack](../guide/translating): `label`, `apply`, and `remove` and `applied` (functions of the code).

## Usage

```ts
import { BlessCouponInput } from "blessing-ui";
```

## API

<PropsTable name="BlessCouponInput" />

<script setup>
import CouponInputBasic from "../demos/CouponInputBasic.vue";
</script>
