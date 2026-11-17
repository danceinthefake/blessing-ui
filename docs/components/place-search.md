---
title: Place search
---

<script setup>
import PlaceSearchBasic from "../demos/PlaceSearchBasic.vue";
</script>

# Place search

<p class="bless-lead">A search for places with results that show the address and the distance</p>

Finds a shop, a station, or an address, often above a [map with pins](./map-pins). For a choice from a fixed list, use the [combobox](./combobox).

<Demo title="Basic">
  <PlaceSearchBasic />
  <template #code>

<<< ../demos/PlaceSearchBasic.vue

  </template>
</Demo>

- `search` is your function. It gets the text and returns a promise of places. Each place has an `id`, a `name`, and optional `address`, `distance` in meters, and `kind`.
- The search starts after `min-length` characters (default 2) and a wait of `delay` milliseconds after the last key (default 250). If an older search ends after a newer one, its answer is dropped.
- The field is a combobox. The Down and Up arrow keys move through the results, Enter picks one, and Escape closes the list.
- `v-model` is the chosen place. The field then shows its name.
- A status line says "Searching…", the number of places, "No places found.", or an error. Screen readers hear it.
- `locale` formats the distances. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessPlaceSearch } from "blessing-ui";
```

## API

<PropsTable name="BlessPlaceSearch" />
