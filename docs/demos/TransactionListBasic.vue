<template>
  <BlessTransactionList :transactions currency="IDR" locale="id-ID" style="max-width: 480px" />
</template>

<script setup lang="ts">
import { BlessTransactionList, type BlessTransaction } from "blessing-ui";

// the studio account over three days
const transactions: BlessTransaction[] = [
  {
    id: "t1",
    title: "Sponsor: Radio Kita",
    amount: 2500000,
    date: "2026-11-16",
    category: "Income",
    icon: "💼",
  },
  {
    id: "t2",
    title: "Pop filter",
    amount: -185000,
    date: "2026-11-16",
    category: "Gear",
    icon: "🎙️",
    pending: true,
  },
  {
    id: "t3",
    title: "Hosting, November",
    amount: -150000,
    date: "2026-11-15",
    category: "Services",
    icon: "🌐",
  },
  {
    id: "t4",
    title: "Coffee with the guest",
    amount: -64000,
    date: "2026-11-15",
    category: "Food",
    icon: "☕",
  },
  {
    id: "t5",
    title: "Listener tips",
    amount: 320000,
    date: "2026-11-13",
    category: "Income",
    icon: "💛",
  },
];
</script>
