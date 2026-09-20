<script setup lang="ts">
import { ref } from "vue";
import { BlessDataTable, type BlessDataColumn } from "blessing-ui";
type Ep = { id: number; title: string; views: number };
// pretend API: 200 rows on a server; we only ever hold one page
const db: Ep[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}話`,
  views: 900 + ((i * 7919) % 5000),
}));
const rows = ref<Ep[]>([]);
const total = ref(0);
const loading = ref(false);
const columns: BlessDataColumn<Ep>[] = [
  { key: "id", label: "#", sortable: true, width: "56px" },
  { key: "title", label: "Title", sortable: true, header: true },
  { key: "views", label: "Views", sortable: true, align: "right" },
];
async function fetchPage(s: {
  sortKey: string | null;
  sortDir: "asc" | "desc";
  query: string;
  page: number;
  pageSize: number;
}) {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 250)); // network
  let list = db.filter((e) => !s.query || e.title.includes(s.query));
  if (s.sortKey)
    list = [...list].sort(
      (a, b) =>
        ((a[s.sortKey as keyof Ep] as number) > (b[s.sortKey as keyof Ep] as number) ? 1 : -1) *
        (s.sortDir === "asc" ? 1 : -1),
    );
  total.value = list.length;
  rows.value = list.slice((s.page - 1) * s.pageSize, s.page * s.pageSize);
  loading.value = false;
}
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessDataTable
      :rows
      :columns
      row-key="id"
      server
      :total
      :page-size="5"
      searchable
      caption="Episodes (server-paged)"
      @state="fetchPage"
    />
    <small>{{
      loading ? "loading…" : `${total} rows on the “server”, ${rows.length} in the DOM`
    }}</small>
  </div>
</template>
