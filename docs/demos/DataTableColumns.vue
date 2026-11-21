<template>
  <BlessDataTable
    v-model:widths="widths"
    :columns="columns"
    :rows="rows"
    row-key="id"
    selectable
    resizable
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessDataTable, type BlessDataColumn } from "blessing-ui";

type Order = {
  id: string;
  customer: string;
  city: string;
  items: number;
  placed: string;
  shipped: string;
  carrier: string;
  total: string;
};
const cities = ["Tokyo", "Osaka", "Bandung", "Surabaya", "Kyoto"];
const rows: Order[] = Array.from({ length: 8 }, (_, i) => ({
  id: `A-${1040 + i}`,
  customer: ["Megumi Kato", "Eriri Spencer", "Utaha Kasumigaoka", "Michiru Hyodo"][i % 4]!,
  city: cities[i % 5]!,
  items: (i % 4) + 1,
  placed: `2026-10-${String(i + 1).padStart(2, "0")}`,
  shipped: `2026-10-${String(i + 3).padStart(2, "0")}`,
  carrier: i % 2 ? "JNE" : "Yamato",
  total: `$${(18.5 * ((i % 4) + 1)).toFixed(2)}`,
}));
const columns: BlessDataColumn<Order>[] = [
  { key: "id", label: "Order", pin: "start", header: true, resizable: false, width: "96px" },
  { key: "customer", label: "Customer", sortable: true },
  { key: "city", label: "City" },
  { key: "items", label: "Items", align: "right" },
  { key: "placed", label: "Placed", sortable: true },
  { key: "shipped", label: "Shipped" },
  { key: "carrier", label: "Carrier" },
  { key: "total", label: "Total", align: "right", pin: "end" },
];
// bind the widths to keep them, for example in localStorage
const widths = ref<Record<string, number>>({});
</script>
