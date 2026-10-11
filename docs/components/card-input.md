---
title: CardInput
---

<script setup>
import CardInputBasic from "../demos/CardInputBasic.vue";
</script>

# CardInput

<p class="bless-lead">Card number with groups, brand, and Luhn check</p>

A field for a payment card number. It groups the digits as they print on the card, names the network, and checks the number. Use it with a payment provider that accepts the number from your own form. If the provider gives you hosted fields, use those instead, because the number then never touches your page.

<Demo title="Basic">
  <CardInputBasic />
  <template #code>

<<< ../demos/CardInputBasic.vue

  </template>
</Demo>

- `v-model` holds the digits only (`4242424242424242`). The box shows the groups: 4-4-4-4, and 4-6-5 for American Express.
- Type, paste, or edit in the middle of the number. The component drops other characters, cuts the number to the length of its network, and keeps the caret next to the digit that you typed.
- The network name (`visa`, `mastercard`, `amex`, `discover`, `jcb`, `diners`, `unionpay`) shows at the end of the field. `brand` fires when it changes. `cardBrand`, `formatCard` and `luhn` are exported.
- When the number is complete and fails the Luhn check, the field turns invalid after blur and shows "Check the card number". Replace the text with `labels.invalid`. `:validate="false"` turns the check off.
- The Luhn check finds typing errors. It does not tell you that the card exists or has funds.
- The field sets `inputmode="numeric"` and `autocomplete="cc-number"`, so phones show the number keypad and browsers offer saved cards.

## Usage

```ts
import { BlessCardInput } from "blessing-ui";
```

## API

<PropsTable name="BlessCardInput" />
