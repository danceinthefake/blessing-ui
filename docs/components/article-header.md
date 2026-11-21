---
title: Article header
---

# Article header

<p class="bless-lead">The title, the author, the date, the reading time, and the topic of an article</p>

The top of a news story, a blog post, or a guide. Put the text of the article under it, for example in the [markdown](./markdown) component.

<Demo title="Basic">
  <ArticleHeaderBasic />
  <template #code>

<<< ../demos/ArticleHeaderBasic.vue

  </template>
</Demo>

- `title` is the title. `level` sets its heading level (default 1). Use 1 on the page of the article.
- `topic` shows above the title. With `topicHref`, it is a link.
- `summary` is one or two lines under the title.
- `author` has a `name`, and an optional `avatar` and `href`.
- `date` and `updated` are days as `YYYY-MM-DD`. They show in `time` elements, so search engines and tools can read them. `minutes` shows the reading time.
- `locale` sets the format of the dates. Change the words with `labels` or a [label pack](../guide/translating): the functions `by`, `read`, and `updated`.

## Usage

```ts
import { BlessArticleHeader } from "blessing-ui";
```

## API

<PropsTable name="BlessArticleHeader" />

<script setup>
import ArticleHeaderBasic from "../demos/ArticleHeaderBasic.vue";
</script>
