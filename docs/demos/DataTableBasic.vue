<script setup lang="ts">
import { ref } from "vue";
import {
  BlessBadge,
  BlessButton,
  BlessDataTable,
  useToast,
  type BlessDataColumn,
} from "blessing-ui";
type Ep = { id: number; title: string; air: string; views: number; status: "aired" | "upcoming" };
const titles = [
  "プロローグ",
  "運命の出会い",
  "フラグの立たない",
  "冴えない彼女",
  "同人誌",
  "夏合宿",
  "文化祭",
  "クリスマス",
];
const rows: Ep[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}話 ${titles[i % 8]}`,
  air: `2017-04-${String((i % 28) + 1).padStart(2, "0")}`,
  views: Math.round(1200 + Math.sin(i) * 500 + i * 37),
  status: i < 20 ? "aired" : "upcoming",
}));
const columns: BlessDataColumn<Ep>[] = [
  { key: "id", label: "#", sortable: true, width: "56px", hideable: false },
  { key: "title", label: "Title", sortable: true, header: true },
  { key: "air", label: "Aired", sortable: true },
  { key: "views", label: "Views", sortable: true, align: "right" },
  { key: "status", label: "Status" },
];
const selected = ref<Ep[]>([]);
const { toast } = useToast();
</script>

<template>
  <BlessDataTable
    :rows
    :columns
    row-key="id"
    selectable
    searchable
    :search-keys="['title', 'air']"
    :page-size="5"
    caption="Episodes"
    @update:selected="selected = $event"
  >
    <template #toolbar="{ selected: s }">
      <BlessButton
        v-if="s.length"
        size="sm"
        color="danger"
        variant="outline"
        @click="toast(`${s.length} removed`)"
        >Delete {{ s.length }}</BlessButton
      >
    </template>
    <template #cell-status="{ value }">
      <BlessBadge :color="value === 'aired' ? 'success' : 'warning'">{{ value }}</BlessBadge>
    </template>
    <template #cell-views="{ value }">{{ Number(value).toLocaleString() }}</template>
  </BlessDataTable>
</template>
