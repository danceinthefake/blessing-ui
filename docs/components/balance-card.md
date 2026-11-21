---
title: Balance card
---

# Balance card

<p class="bless-lead">The balance of an account, with the change and the main actions</p>

Shows how much money an account holds, at the top of a bank or wallet screen. For any other single number, use the [stat](./stat).

<Demo title="Basic">
  <BalanceCardBasic />
  <template #code>

<<< ../demos/BalanceCardBasic.vue

  </template>
</Demo>

- `label` is the name of the account, and `amount` is the balance.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format (default English).
- `change` is the change over `period`, in the same currency. It shows with a sign and a word, such as "+$2.00 up". A drop is also red, but the sign and the word carry the meaning.
- The eye button hides the amount and the change, for a screen that other people can see. `v-model:masked` holds that state. Screen readers hear "Hidden" in place of the amount.
- Put buttons such as Transfer in the default slot.
- Change the words with `labels` or a [label pack](../guide/translating): `show`, `hide`, `hidden`, `up`, and `down`.

## Usage

```ts
import { BlessBalanceCard } from "blessing-ui";
```

## API

<PropsTable name="BlessBalanceCard" />

<script setup>
import BalanceCardBasic from "../demos/BalanceCardBasic.vue";
</script>
