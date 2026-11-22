<template>
  <div class="search">
    <form class="search__form" role="search" @submit.prevent="run()">
      <BlessText as="h1" size="lg" weight="light">Search help</BlessText>
      <div class="search__box">
        <BlessInput
          v-model="draft"
          type="search"
          aria-label="Search the help center"
          placeholder="For example: invite"
          class="search__input"
        />
        <BlessButton type="submit">Search</BlessButton>
      </div>
    </form>
    <section v-if="!query" class="search__popular" aria-labelledby="search-popular">
      <BlessText id="search-popular" as="h2" size="sm" weight="bold">Popular searches</BlessText>
      <BlessSuggestions :items="popular" @select="(q: string) => run(q)" />
    </section>
    <BlessSearchResults
      v-else
      v-model:selected="selected"
      v-model:sort="sort"
      v-model:page="page"
      :query
      :results="hits"
      :total="result.total"
      :page-size="pageSize"
      :facets="result.facets"
      :sorts="[
        { value: 'relevance', label: 'Best match' },
        { value: 'newest', label: 'Newest' },
      ]"
      :suggestion="result.suggestion"
      :class="{ 'is-loading': loading }"
      :aria-busy="loading"
      locale="en-US"
      @suggest="run"
    />
  </div>
</template>

<script setup lang="ts">
import {
  BlessButton,
  BlessInput,
  BlessSearchResults,
  BlessSuggestions,
  BlessText,
} from "blessing-ui";
import { computed } from "vue";
import { mockSearchApi } from "./api";
import { useSearch } from "./useSearch";

const { draft, query, selected, sort, page, pageSize, result, loading, popular, run } =
  useSearch(mockSearchApi);
const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const hits = computed(() =>
  result.value.results.map((d) => ({ ...d, date: date.format(new Date(`${d.date}T00:00:00Z`)) })),
);
</script>

<style scoped>
.search {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.search__form,
.search__popular {
  display: grid;
  gap: var(--bless-space-3);
}
.search__box {
  display: flex;
  gap: var(--bless-space-2);
  max-width: 36rem;
}
.search__input {
  flex: 1;
  min-width: 0;
}
.is-loading {
  opacity: 0.6;
}
@media (max-width: 760px) {
  .search {
    padding-inline: var(--bless-space-4);
  }
}
</style>
