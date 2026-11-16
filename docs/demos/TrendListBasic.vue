<script setup lang="ts">
import { BlessTrendList, type BlessTrend } from "blessing-ui";

const trends: BlessTrend[] = [
  {
    id: "1",
    topic: "#homestudio",
    category: "Music · Trending",
    posts: 15300,
    href: "#homestudio",
  },
  { id: "2", topic: "Episode 41", category: "Podcasts", posts: 4820, href: "#ep41" },
  {
    id: "3",
    topic: "#micsetup",
    category: "Trending in Indonesia",
    posts: 2110,
    href: "#micsetup",
  },
  { id: "4", topic: "Radio Kita", category: "Media", posts: 960, href: "#radio" },
  { id: "5", topic: "#roomtreatment", posts: 412, href: "#room" },
];
</script>

<template>
  <BlessTrendList :trends style="max-width: 320px" />
</template>
