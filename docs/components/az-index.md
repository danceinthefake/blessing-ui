---
title: A to Z index
---

# A to Z index

<p class="bless-lead">A list in groups by first letter, with a bar of letters to jump</p>

Lists many services, topics, or terms, so people can find one by its name. Government sites often have one page like this for all their services.

<Demo title="Basic">
  <AzIndexBasic />
  <template #code>

<<< ../demos/AzIndexBasic.vue

  </template>
</Demo>

- `items` is the list. Each item has a `label` and an optional `href`.
- The items sort in the order of `locale`, with numbers in their natural order. They group by the first letter without its accent, so "Évian" goes under E.
- A name that starts with a sign that is not in `letters` goes under "#". Screen readers hear "Other" for it.
- The bar on top links to each letter that has names. A letter without names stays in its place, dim and dashed, so the bar does not move. The bar stays on top when you scroll. If your page has a fixed header, set `--bless-az-top` to its height.
- Each letter is a heading of level 3, so screen reader users can jump from letter to letter.
- `letters` sets the letters of the bar (default A to Z). Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessAzIndex } from "blessing-ui";
```

## API

<PropsTable name="BlessAzIndex" />

<script setup>
import AzIndexBasic from "../demos/AzIndexBasic.vue";
</script>
