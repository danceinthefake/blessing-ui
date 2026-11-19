<script setup lang="ts">
import {
  BlessButton,
  BlessFaqSearch,
  BlessForm,
  BlessInput,
  BlessKnowledgeArticle,
  BlessSearchResults,
  BlessText,
} from "blessing-ui";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { mockHelpApi } from "./api";
import { facets, search, toHit, type Article, type BlessFaq } from "./domain";

const articles = ref<Article[]>([]);
const faq = ref<BlessFaq[]>([]);
const draft = ref("");
const query = ref("");
const selected = ref<Record<string, string[]>>({});
const page = ref(1);
const pageSize = 4;

// each article has its own link (#help-<id>), so Back and a shared link work
const openId = ref("");
const readHash = () =>
  (openId.value = location.hash.startsWith("#help-") ? location.hash.slice(6) : "");
onMounted(async () => {
  [articles.value, faq.value] = await Promise.all([mockHelpApi.articles(), mockHelpApi.faq()]);
  readHash();
  addEventListener("hashchange", readHash);
});
onBeforeUnmount(() => removeEventListener("hashchange", readHash));
const article = computed(() => articles.value.find((a) => a.id === openId.value));
// an opened article takes focus at its title, so a screen reader starts there
const view = ref<HTMLElement>();
watch(article, (a) =>
  nextTick(() => {
    const h = a && view.value?.querySelector<HTMLElement>("h1, h2");
    if (h) (h.setAttribute("tabindex", "-1"), h.focus());
  }),
);
const back = () => (location.hash = "");

const found = computed(() => search(articles.value, query.value));
const hits = computed(() => {
  const k = selected.value.kind ?? [];
  return found.value.filter((a) => !k.length || k.includes(a.kind)).map(toHit);
});
const shown = computed(() => hits.value.slice((page.value - 1) * pageSize, page.value * pageSize));
watch([query, selected], () => (page.value = 1), { deep: true });

function submit() {
  query.value = draft.value.trim();
  selected.value = {};
  if (openId.value) location.hash = "";
}
const related = (a: Article) =>
  a.related.flatMap((id) => {
    const r = articles.value.find((x) => x.id === id);
    return r ? [{ title: r.title, href: `#help-${r.id}` }] : [];
  });
</script>

<template>
  <div class="help">
    <header class="help__head">
      <BlessText as="h2" size="xl" weight="light">How can we help?</BlessText>
      <BlessForm class="help__search" role="search" @submit="submit">
        <BlessInput
          v-model="draft"
          type="search"
          aria-label="Search the help center"
          placeholder="For example: saves, refund, black screen"
        />
        <BlessButton type="submit">Search</BlessButton>
      </BlessForm>
    </header>

    <div v-if="article" ref="view">
      <a href="#" class="help__back" @click.prevent="back">← Back</a>
      <BlessKnowledgeArticle
        :title="article.title"
        :updated="article.updated"
        :sections="article.sections"
        :related="related(article)"
      />
    </div>
    <BlessSearchResults
      v-else-if="query"
      v-model:selected="selected"
      v-model:page="page"
      :query
      :results="shown"
      :total="hits.length"
      :page-size
      :facets="facets(found)"
    />
    <section v-else aria-labelledby="help-faq">
      <BlessText id="help-faq" as="h3" size="md" weight="bold">Common questions</BlessText>
      <BlessFaqSearch :items="faq" :labels="{ search: 'Filter these questions' }" />
    </section>
  </div>
</template>

<style scoped>
.help {
  display: grid;
  gap: var(--bless-space-6);
  padding: var(--bless-space-6);
  max-width: 1040px;
}
.help__head {
  display: grid;
  gap: var(--bless-space-3);
}
.help__head h2,
.help h3 {
  margin: 0 0 var(--bless-space-2);
}
.help__search {
  display: flex;
  gap: var(--bless-space-2);
  align-items: end;
  max-width: 640px;
}
.help__search > :first-child {
  flex: 1;
}
.help__back {
  display: inline-block;
  margin-bottom: var(--bless-space-3);
  color: var(--bless-color-accent-text);
  font-size: var(--bless-text-sm);
}
@media (max-width: 700px) {
  .help {
    padding: var(--bless-space-4);
  }
}
</style>
