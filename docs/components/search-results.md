---
title: Search results
---

<script setup>
import SearchResultsBasic from "../demos/SearchResultsBasic.vue";
</script>

# Search results

<p class="bless-lead">A results page with the count, the sort, the facets, the results, and the pages</p>

Builds the page that comes after a search. Your search service finds the hits, and this page shows them.

<Demo title="Basic">
  <SearchResultsBasic />
  <template #code>

<<< ../demos/SearchResultsBasic.vue

  </template>
</Demo>

- `query` is the search. `results` is the hits of this page only, and `total` is the number of hits on all pages.
- Each hit shows as a [search result](./search-result) with the search words marked.
- The status line says the range and the count, such as "11–20 of 32 results". If there are no hits, it says so, and tips follow.
- `facets` adds a [facet filter](./facet-filter) on the side, in `v-model:selected`. On a narrow screen, it goes on top and can close.
- `sorts` adds a sort menu in `v-model:sort`. `v-model:page` and `page-size` drive the [pagination](./pagination).
- `suggestion` shows "Did you mean" with a button that emits `suggest`.
- When a filter or the sort changes, set the page back to 1, as the example does.
- `locale` formats the numbers. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessSearchResults } from "blessing-ui";
```

## API

<PropsTable name="BlessSearchResults" />
