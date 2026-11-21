---
title: Knowledge article
---

# Knowledge article

<p class="bless-lead">A help article with contents, the date of the last change, and a question if it helped</p>

Builds one page of a help center or a knowledge base.

<Demo title="Basic">
  <KnowledgeArticleBasic />
  <template #code>

<<< ../demos/KnowledgeArticleBasic.vue

  </template>
</Demo>

- `title` is the heading of the article. `updated` is the date of the last change as text.
- `sections` is the body. Each section has a `title` and a `body` of plain text, and a blank line starts a new paragraph.
- If there are two sections or more, [contents](./toc) on top link to them and mark the one in view.
- The reading time comes from the number of words, at 200 words a minute.
- "Did this article help you?" has Yes and No buttons that emit `helpful` with true or false. Then a status line says thank you.
- `related` adds a list of links to other articles.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessKnowledgeArticle } from "blessing-ui";
```

## API

<PropsTable name="BlessKnowledgeArticle" />

<script setup>
import KnowledgeArticleBasic from "../demos/KnowledgeArticleBasic.vue";
</script>
