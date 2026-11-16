---
title: Store locator
---

<script setup>
import StoreLocatorBasic from "../demos/StoreLocatorBasic.vue";
</script>

# Store locator

<p class="bless-lead">A list of stores by distance, with opening hours and directions</p>

Helps a buyer find a store, or pick one for pickup at checkout. It draws no map, because a map needs a map service. Use the links to send the buyer to the map service of your choice.

<Demo title="Basic">
  <StoreLocatorBasic />
  <template #code>

<<< ../demos/StoreLocatorBasic.vue

  </template>
</Demo>

- `stores` is a list of stores. Each store has an `id`, a `name`, and an `address`. It can also have a `distance` in km, `open`, `hours` as text, a `phone`, and a `directions` link.
- The nearest store comes first. Stores without a distance come last. You find the distance on your server, or from the position that the Geolocation API gives.
- `open` shows "Open now" or "Closed" in words.
- The search field filters by name and address. If no store matches, a status line says so.
- `v-model` is the id of the chosen store. Each store is a native radio button.
- The Directions and Call links have the name of the store in their accessible name, so each link is clear on its own.
- `locale` sets the format of the distance. Change the words with `labels` or a [label pack](../guide/translating): `title`, `search`, `open`, `closed`, `directions`, `call`, `none`, and `away` (a function).

## Usage

```ts
import { BlessStoreLocator } from "blessing-ui";
```

## API

<PropsTable name="BlessStoreLocator" />
