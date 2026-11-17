<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BlessSearchResults, type BlessSearchHit } from "blessing-ui";

// a small index searched in the page; a real site asks its search service
const all: (BlessSearchHit & { year: number })[] = [
  {
    id: "1",
    title: "Renew your passport online",
    href: "https://example.go.id/services/passport/renew",
    kind: "Service",
    year: 2026,
    snippet: "Renew an adult passport that ends within the next 9 months.",
  },
  {
    id: "2",
    title: "Passport fees for 2026",
    href: "https://example.go.id/guides/passport-fees",
    kind: "Guide",
    year: 2026,
    snippet: "The fee for a 48-page passport is Rp 350,000.",
  },
  {
    id: "3",
    title: "Lost or stolen passport",
    href: "https://example.go.id/services/passport/lost",
    kind: "Service",
    year: 2025,
    snippet: "Report a lost passport, then apply for a new one.",
  },
  {
    id: "4",
    title: "Passport photo rules",
    href: "https://example.go.id/guides/passport-photo",
    kind: "Guide",
    year: 2025,
    snippet: "Use a plain white background and a neutral face.",
  },
  {
    id: "5",
    title: "Passport for a child",
    href: "https://example.go.id/services/passport/child",
    kind: "Service",
    year: 2026,
    snippet: "Both parents must agree before a child gets a passport.",
  },
  {
    id: "6",
    title: "Passport office opening hours",
    href: "https://example.go.id/offices/hours",
    kind: "Page",
    year: 2024,
    snippet: "Most passport offices open from 08:00 to 15:00.",
  },
  {
    id: "7",
    title: "Travel letter instead of a passport",
    href: "https://example.go.id/guides/travel-letter",
    kind: "Guide",
    year: 2024,
    snippet: "A travel letter lets you go home if your passport is lost abroad.",
  },
];
const query = "passport";
const selected = ref<Record<string, string[]>>({});
const sort = ref("best");
const page = ref(1);
const pageSize = 3;
const kinds = ["Service", "Guide", "Page"];
const facets = computed(() => [
  {
    id: "kind",
    label: "Kind",
    options: kinds.map((k) => ({
      value: k,
      label: k,
      count: all.filter((r) => r.kind === k).length,
    })),
  },
]);
const hits = computed(() => {
  const k = selected.value.kind ?? [];
  const list = all.filter((r) => !k.length || k.includes(r.kind!));
  return sort.value === "new" ? [...list].sort((a, b) => b.year - a.year) : list;
});
watch([selected, sort], () => (page.value = 1), { deep: true });
const shown = computed(() => hits.value.slice((page.value - 1) * pageSize, page.value * pageSize));
</script>

<template>
  <BlessSearchResults
    v-model:selected="selected"
    v-model:sort="sort"
    v-model:page="page"
    :query
    :results="shown"
    :total="hits.length"
    :page-size
    :facets
    :sorts="[
      { value: 'best', label: 'Best match' },
      { value: 'new', label: 'Newest' },
    ]"
  />
</template>
