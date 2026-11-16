---
title: Currency converter
---

<script setup>
import CurrencyConverterBasic from "../demos/CurrencyConverterBasic.vue";
</script>

# Currency converter

<p class="bless-lead">An amount in one currency and its value in another</p>

Converts money for a travel, shop, or bank app. You give the rates, and the component does the math and the formats. It fetches nothing.

<Demo title="Basic">
  <CurrencyConverterBasic />
  <template #code>

<<< ../demos/CurrencyConverterBasic.vue

  </template>
</Demo>

- `rates` maps each ISO 4217 code to its units for one unit of a common base. For example, `{ USD: 1, IDR: 16250 }` means 16,250 rupiah for one dollar. The menus list these codes with the name of each currency in the `locale`.
- `v-model:amount`, `v-model:from`, and `v-model:to` hold the amount and the two currencies. The ⇄ button swaps the currencies.
- The result is an `output` element, so screen readers hear each new value. Under it, a line shows the rate for one unit, such as "$1.00 = IDR 16,250".
- `updated` is the time of the rates, as text. It shows after the rate line.
- Each currency uses its own number of decimals, such as 0 for IDR and 2 for USD. The number is the same in every browser and on the server.
- Change the words with `labels` or a [label pack](../guide/translating): `amount`, `from`, `to`, `swap`, `result`, and `updated` (a function).

## Usage

```ts
import { BlessCurrencyConverter } from "blessing-ui";
```

## API

<PropsTable name="BlessCurrencyConverter" />
