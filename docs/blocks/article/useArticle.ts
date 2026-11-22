import { computed, onMounted, ref } from "vue";
import type { ArticleApi } from "./api";
import { minutes, prepare, type Article } from "./domain";

/** an article with its parts, notes, table of contents, and reading time */
export function useArticle(api: ArticleApi, slug: string) {
  const article = ref<Article>();
  onMounted(async () => (article.value = await api.article(slug)));
  const ready = computed(() => (article.value ? prepare(article.value.blocks) : undefined));
  const readMinutes = computed(() => (article.value ? minutes(article.value.blocks) : 0));
  return { article, ready, readMinutes };
}
