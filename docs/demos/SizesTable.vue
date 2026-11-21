<template>
  <BlessDataTable
    :rows
    :columns
    row-key="name"
    searchable
    :search-keys="['name']"
    :page-size="20"
    caption="Size of each component, gzipped"
  >
    <template #cell-js="{ value }">{{ kb(value) }}</template>
    <template #cell-css="{ value }">{{ kb(value) }}</template>
    <template #cell-total="{ value }">{{ kb(value) }}</template>
  </BlessDataTable>
</template>

<script setup lang="ts">
import { BlessDataTable, type BlessDataColumn } from "blessing-ui";
import sizes from "../.vitepress/sizes.json";

type Row = { name: string; js: number; css: number; total: number };
const rows: Row[] = sizes.map((s) => ({ ...s, total: s.js + s.css }));
const columns: BlessDataColumn<Row>[] = [
  { key: "name", label: "Component", sortable: true, header: true },
  { key: "js", label: "JS", sortable: true, align: "right" },
  { key: "css", label: "CSS", sortable: true, align: "right" },
  { key: "total", label: "Total", sortable: true, align: "right" },
];
const kb = (b: unknown) => `${(Number(b) / 1000).toFixed(1)} KB`;
</script>
