---
title: Search result
---

<script setup>
import SearchResultBasic from "../demos/SearchResultBasic.vue";
</script>

# Search result

<p class="bless-lead">One result with the title, the address, and a snippet with the search words marked</p>

Shows one hit of a site search or a search engine. The [search results](./search-results) page puts many of them in a list.

<Demo title="Basic">
  <SearchResultBasic />
  <template #code>

<<< ../demos/SearchResultBasic.vue

  </template>
</Demo>

- `title` and `href` make the link. The address above the title shows as parts, such as "example.go.id › services › passport".
- `snippet` is a short piece of the page. `query` marks the search words in the title and the snippet with the [highlight](./highlight).
- `kind` adds a tag, such as "Service" or "PDF". `date` goes before the snippet.
- The title is a heading of level 3, so screen reader users can jump from result to result.

## Usage

```ts
import { BlessSearchResult } from "blessing-ui";
```

## API

<PropsTable name="BlessSearchResult" />
