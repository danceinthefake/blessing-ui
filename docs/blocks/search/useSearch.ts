import { onMounted, ref, watch } from "vue";
import type { SearchApi } from "./api";
import type { Page, Query } from "./domain";

/** the search box, the filters, sort and page, and the page of hits they give */
export function useSearch(api: SearchApi, pageSize = 5) {
  const draft = ref("");
  const query = ref("");
  const selected = ref<Record<string, string[]>>({});
  const sort = ref<Query["sort"]>("relevance");
  const page = ref(1);
  const result = ref<Page>({ results: [], total: 0, facets: [] });
  const loading = ref(false);
  const popular = ref<string[]>([]);
  onMounted(async () => (popular.value = await api.popular()));

  // a new search starts with no filters; a new filter or sort starts at page 1
  watch(query, () => (selected.value = {}));
  watch([query, selected, sort], () => (page.value = 1));
  let last = 0;
  watch(
    [query, selected, sort, page],
    async () => {
      if (!query.value) return;
      const ticket = ++last;
      loading.value = true;
      const r = await api.search({
        q: query.value,
        selected: selected.value,
        sort: sort.value,
        page: page.value,
        pageSize,
      });
      // a slow answer to an old search must not replace a newer one
      if (ticket !== last) return;
      result.value = r;
      loading.value = false;
    },
    { flush: "post" },
  );

  function run(q = draft.value) {
    draft.value = q;
    query.value = q.trim();
  }

  return { draft, query, selected, sort, page, pageSize, result, loading, popular, run };
}
