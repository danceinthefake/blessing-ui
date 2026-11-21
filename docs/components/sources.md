---
title: Sources
---

# Sources

<p class="bless-lead">The sources of a reply, with numbered marks that link to them</p>

Shows the pages that a reply uses, under the reply. Each source has a number, so a mark such as <sup>2</sup> in the text can point to it. For a list of links that is not about a reply, use the [list](./list).

<Demo title="Basic">
  <SourcesBasic />
  <template #code>

<<< ../demos/SourcesBasic.vue

  </template>
</Demo>

- `sources` is a list. Each source has a `title`, a `url`, an optional `site` name, and an optional `snippet`. With no `site`, the item shows the host of the URL without `www.`.
- Item 2 has the id `<id>-2`. Set `id` to a fixed value, and link each mark in the reply to `#<id>-2`. If the reader follows a mark, the item gets the accent color.
- Put the `bless-source-mark` class on each mark to get the small numbered box. Give each mark an `aria-label` such as "source 2", because a lone number does not say much to a screen reader.
- The list is a region named by its title. Change the title with `labels` or a [label pack](../guide/translating): `title`.

## Usage

```ts
import { BlessSources } from "blessing-ui";
```

## API

<PropsTable name="BlessSources" />

<script setup>
import SourcesBasic from "../demos/SourcesBasic.vue";
</script>
