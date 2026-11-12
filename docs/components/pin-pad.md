---
title: PinPad
---

<script setup>
import PinPadBasic from "../demos/PinPadBasic.vue";
</script>

# PinPad

<p class="bless-lead">On-screen keypad for a PIN</p>

A keypad with large keys, for a PIN on a kiosk, a point of sale, a tablet, or a lock screen. On a page with a keyboard, a one-time code in [InputOTP](./input-otp) is easier to use.

<Demo title="Basic">
  <PinPadBasic />
  <template #code>

<<< ../demos/PinPadBasic.vue

  </template>
</Demo>

- `v-model` is the PIN as a string of digits. `length` (default 4) sets the number of digits. When the last digit is entered, `complete` sends the PIN, and more keys do nothing.
- The dots show how many digits are entered, never the digits. A screen reader hears "2 of 4 digits entered" after each key.
- Clear removes all digits and ⌫ removes the last one. A hardware keyboard works too, when the focus is in the pad: digits type, Backspace removes the last one, and Delete clears.
- `invalid` makes the dots red. Set it when the PIN is wrong, and clear the PIN, as the demo does. Say why in text as well, because color alone does not tell everyone.
- With `name`, a hidden input sends the PIN with its form.
- The keys are always in the same order. Change the words with `labels` or a [label pack](../guide/translating). `labels.pin` names the pad (default "PIN").

## Usage

```ts
import { BlessPinPad } from "blessing-ui";
```

## API

<PropsTable name="BlessPinPad" />
