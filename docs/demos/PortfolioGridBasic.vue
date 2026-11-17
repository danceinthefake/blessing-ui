<script setup lang="ts">
import { ref } from "vue";
import { BlessPortfolioGrid, type BlessWork } from "blessing-ui";
import { art } from "./_data";

const works: BlessWork[] = [
  {
    id: "1",
    title: "Gema Audio brand",
    kind: "Brand",
    image: art("🔊", "f3d9c4"),
    href: "#gema",
    year: 2026,
  },
  {
    id: "2",
    title: "Podcast cover set",
    kind: "Illustration",
    image: art("🎧", "d7ecd0"),
    href: "#covers",
    year: 2026,
  },
  {
    id: "3",
    title: "Ruang Rekam booking site",
    kind: "Web",
    image: art("📅", "c9dcf2"),
    href: "#booking",
    year: 2025,
  },
  {
    id: "4",
    title: "Festival poster",
    kind: "Illustration",
    image: art("🎪", "f6e3a1"),
    href: "#poster",
    year: 2025,
  },
  {
    id: "5",
    title: "Nada Kita packaging",
    kind: "Brand",
    image: art("📦", "e8d5f2"),
    href: "#pack",
    year: 2024,
  },
  {
    id: "6",
    title: "Studio store",
    kind: "Web",
    image: art("🛍️", "f2d5d5"),
    href: "#store",
    year: 2024,
  },
];
const filter = ref("");
</script>

<template>
  <BlessPortfolioGrid v-model:filter="filter" :works />
</template>
