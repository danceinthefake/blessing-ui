---
title: PhoneInput
---

<script setup>
import PhoneInputBasic from "../demos/PhoneInputBasic.vue";
</script>

# PhoneInput

<p class="bless-lead">Country code select and phone number (E.164)</p>

A country code select and a phone number in one field. The value is the full international number, so you can store and send it without more work. The component does not check that a number exists. For that, use a server-side library such as libphonenumber.

<Demo title="Basic">
  <PhoneInputBasic />
  <template #code>

<<< ../demos/PhoneInputBasic.vue

  </template>
</Demo>

- `v-model` is the number as `+` and digits (E.164), for example `+628123456789`. It is empty until the person types a digit.
- `v-model:country` is the region code of the selected country (`ID`). `defaultCountry` sets it while the value is empty.
- People can type the number the way they say it. The component drops spaces and dashes, and removes a leading zero (`0812…` becomes `+62812…`). The total never goes past 15 digits.
- A value that comes from outside fills both parts. The longest calling code wins, so `+358…` is Finland and not `+3`. `+1` is shared by the US and Canada, so `v-model:country` decides between them.
- `countries` replaces the list of 46 countries with `{ code, dial }` entries. `blessCountries` is the default list. `locale` sets the language of the country names (`Intl.DisplayNames`).
- The number field sets `type="tel"` and `autocomplete="tel-national"`. `labels` names the two controls for screen readers: "Country code" and "Phone number".

## Usage

```ts
import { BlessPhoneInput } from "blessing-ui";
```

## API

<PropsTable name="BlessPhoneInput" />
