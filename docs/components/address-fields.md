---
title: Address fields
---

<script setup>
import AddressFieldsBasic from "../demos/AddressFieldsBasic.vue";
</script>

# Address fields

<p class="bless-lead">Address fields whose order and names follow the country</p>

Asks for a postal address in the form that people of each country know. For example, a US address has a state and a ZIP code, and a Japanese address starts with the postal code. For one line of free text, use the [input](./input).

<Demo title="Basic">
  <AddressFieldsBasic />
  <template #code>

<<< ../demos/AddressFieldsBasic.vue

  </template>
</Demo>

- `v-model` is the address: `country` as an ISO code, and `line1`, `line2`, `city`, `region`, and `postal`.
- `countries` sets the list of countries, as codes. Their names come from `Intl.DisplayNames` in the `locale` (default English).
- A small table gives the rows of fields for Indonesia, the US, Canada, the UK, Germany, France, and Japan. Other countries get a common form. `formats` adds a country or changes one, with its rows and the names of its region and postal code.
- Each field has the right `autocomplete` value, so the browser can fill in a saved address. All fields but the second line are required.
- The fields are native fields in a group named by `label` (default "Address"). Change the names with `labels` or a [label pack](../guide/translating): `country`, `line1`, `line2`, `city`, `state`, `province`, `prefecture`, `county`, `zip`, `postcode`, and `postal`.

## Usage

```ts
import { BlessAddressFields } from "blessing-ui";
```

## API

<PropsTable name="BlessAddressFields" />
