import { computed, onMounted, ref } from "vue";
import { byNewest, type NewsItem } from "./domain";
import { mockNewsApi, type NewsApi } from "./api";

export function useNews(api: NewsApi = mockNewsApi) {
  const items = ref<NewsItem[]>([]);
  const loading = ref(true);
  const filter = ref<NewsItem["category"] | "all">("all");
  const visible = computed(() =>
    items.value.filter((n) => filter.value === "all" || n.category === filter.value).sort(byNewest),
  );
  onMounted(async () => {
    items.value = await api.list();
    loading.value = false;
  });
  return { items, visible, loading, filter };
}
