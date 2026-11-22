<template>
  <div class="art">
    <BlessReadingProgress position="fixed" minutes />
    <template v-if="article && ready">
      <BlessArticleHeader
        :title="article.title"
        :topic="article.topic"
        topic-href="#"
        :summary="article.summary"
        :author="{ name: article.author }"
        :date="article.date"
        :minutes="readMinutes"
        locale="en-GB"
      />
      <BlessShareBar :url="URL" :title="article.title" />
      <div class="art__body">
        <article class="art__text">
          <template v-for="(p, i) in ready.parts" :key="i">
            <h2 v-if="p.type === 'h2'" :id="p.id">{{ p.text }}</h2>
            <h3 v-else-if="p.type === 'h3'" :id="p.id">{{ p.text }}</h3>
            <BlessPullQuote v-else-if="p.type === 'quote'" :text="p.text" :speaker="p.speaker" />
            <p v-else-if="p.type === 'p'">
              <template v-for="(piece, j) in p.pieces" :key="j">
                <BlessFootnoteRef v-if="typeof piece === 'number'" :n="piece" id="art-notes" />
                <template v-else>{{ piece }}</template>
              </template>
            </p>
          </template>
          <BlessFootnotes id="art-notes" :notes="ready.notes" />
        </article>
        <aside class="art__aside">
          <BlessToc :items="ready.toc" label="In this article" />
        </aside>
      </div>
      <BlessRelatedArticles :articles="article.related" :labels="{ title: 'Read next' }" />
    </template>
    <BlessText v-else as="p" muted>Loading…</BlessText>
  </div>
</template>

<script setup lang="ts">
import {
  BlessArticleHeader,
  BlessFootnoteRef,
  BlessFootnotes,
  BlessPullQuote,
  BlessReadingProgress,
  BlessRelatedArticles,
  BlessShareBar,
  BlessText,
  BlessToc,
} from "blessing-ui";
import { mockArticleApi } from "./api";
import { useArticle } from "./useArticle";

const URL = "https://tokosenja.example/journal/a-year-with-a-tea-garden";
const { article, ready, readMinutes } = useArticle(mockArticleApi, "a-year-with-a-tea-garden");
</script>

<style scoped>
.art {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.art__body {
  display: grid;
  grid-template-columns: minmax(0, 42rem) minmax(10rem, 14rem);
  gap: var(--bless-space-8);
  align-items: start;
}
.art__text {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-normal);
  color: var(--bless-color-text);
}
.art__text h2,
.art__text h3 {
  margin: var(--bless-space-8) 0 var(--bless-space-3);
  scroll-margin-top: var(--bless-space-8);
}
.art__text h2 {
  font-size: var(--bless-text-lg);
}
.art__text h3 {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.art__text p {
  margin: 0 0 var(--bless-space-4);
}
.art__aside {
  position: sticky;
  top: var(--bless-space-6);
}
@media (max-width: 760px) {
  .art {
    padding-inline: var(--bless-space-4);
  }
  .art__body {
    grid-template-columns: 1fr;
  }
  /* on a phone the contents come first, above the text */
  .art__aside {
    position: static;
    order: -1;
  }
}
</style>
