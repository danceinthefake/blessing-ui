---
title: Related articles
---

<script setup>
import RelatedArticlesBasic from "../demos/RelatedArticlesBasic.vue";
</script>

# Related articles

<p class="bless-lead">Articles on the same topic, with an image and the reading time</p>

Suggests what to read next, at the end of an article. For one list of headlines, use the [news](../blocks/news) block.

<Demo title="Basic">
  <RelatedArticlesBasic />
  <template #code>

<<< ../demos/RelatedArticlesBasic.vue

  </template>
</Demo>

- `articles` is a list of articles. Each article has an `id`, a `title`, and an `href`. It can also have an `image`, a `topic`, and `minutes` to read.
- The block is a section with a heading, "Read next". `level` sets the level of that heading (default 2).
- Each card has one link, the title. A click anywhere on the card follows it, and the focus ring goes around the whole card. So a keyboard user meets one stop for each card.
- The images are decoration, so they have no text.
- Change the words with `labels` or a [label pack](../guide/translating): `title` and `read` (a function).

## Usage

```ts
import { BlessRelatedArticles } from "blessing-ui";
```

## API

<PropsTable name="BlessRelatedArticles" />
