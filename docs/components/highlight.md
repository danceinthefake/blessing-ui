---
title: Highlight
---

# Highlight

<p class="bless-lead">Text with the search terms marked</p>

Marks the words that people searched for in a result, so they see why it matched. Use it in a list of search results, a [command](./command) menu of your own, or a [data table](./data-table) cell. For a note or a status on a line, use a [marker](./marker).

<Demo title="Basic">
  <HighlightBasic />
  <template #code>

<<< ../demos/HighlightBasic.vue

  </template>
</Demo>

- `text` is the text, and `query` is what to mark. A string is a search: each word in it is marked. A list keeps each term whole, for example `["boring girl"]`.
- Case and accents do not matter: "cafe" marks "Café". The text keeps its own case and accents.
- Each match is a native `<mark>`, so a screen reader can say that the text is marked. Matches that touch or overlap become one mark.
- The text is always text, never HTML, so a result from your users is safe to show.
- The component only marks. Your app decides which results to show.

## Usage

```ts
import { BlessHighlight } from "blessing-ui";
```

## API

<PropsTable name="BlessHighlight" />

<script setup>
import HighlightBasic from "../demos/HighlightBasic.vue";
</script>
