---
title: Facet filter
---

# Facet filter

<p class="bless-lead">Filters for a catalog, with counts, a price range, and clear buttons</p>

Narrows a list of products in the side column of a shop. A facet is one property of the products, such as the brand. For filters as chips in a toolbar, use the [filter bar](./filter-bar).

<Demo title="Basic">
  <FacetFilterBasic />
  <template #code>

<<< ../demos/FacetFilterBasic.vue

  </template>
</Demo>

- `facets` is a list of facets. Each facet has an `id`, a `label`, and `options`. Each option has a `value`, a `label`, and an optional `count`.
- `v-model` holds the chosen values of each facet, by facet id, such as `{ type: ["usb"] }`.
- Each facet is a fieldset of native check boxes. If an option has a count of 0, its check box is off, unless it is already checked.
- A facet with a checked option gets a Clear button. "Clear all" at the top shows the number of active filters and clears them all.
- With `priceRange`, a price facet with two number fields shows. `v-model:price` is `[lowest, highest]`, and an empty field is `undefined`. `currency` and `locale` give the currency symbol.
- Give the new counts from your search after each change.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `price`, `min`, `max`, `clear`, and `clearAll` (a function).

## Usage

```ts
import { BlessFacetFilter } from "blessing-ui";
```

## API

<PropsTable name="BlessFacetFilter" />

<script setup>
import FacetFilterBasic from "../demos/FacetFilterBasic.vue";
</script>
