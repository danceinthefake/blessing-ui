---
title: InputOTP
---

<script setup>
import InputOTPBasic from "../demos/InputOTPBasic.vue";
</script>

# InputOTP

<p class="bless-lead">One-time code cells</p>

For a code the user is sent — by SMS, email or an authenticator app — and types back once. Not for a password or a PIN they choose; that is [PasswordInput](./password-input).

<Demo title="Basic">
  <InputOTPBasic />
  <template #code>

<<< ../demos/InputOTPBasic.vue

  </template>
</Demo>

- `@complete` fires when every cell is filled, so the form can submit itself.
- Paste anywhere and SMS autofill (the first cell is `autocomplete="one-time-code"`) spread across every cell.
- Inside a [Field](./form) the label points at the first cell and the field's error reaches every cell. `name` submits the joined code with the form.
- `separators` splits a long code where the sender does (`123 456`); `masked` hides it from people nearby; `numeric=false` for letter codes.

## Usage

```ts
import { BlessInputOTP } from "blessing-ui";
```

## API

<PropsTable name="BlessInputOTP" />
