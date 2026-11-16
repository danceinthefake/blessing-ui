<script setup lang="ts">
import { BlessForumTopics, type BlessForumTopic } from "blessing-ui";

const topics: BlessForumTopic[] = [
  {
    id: "1",
    title: "What mic do you use under 1 million rupiah?",
    href: "#t1",
    author: "Ana Putri",
    replies: 214,
    views: 18400,
    solved: true,
    tags: ["gear", "budget"],
    last: { author: "Budi Santoso", time: "12 min ago" },
  },
  {
    id: "rules",
    title: "Read first: the rules of this forum",
    href: "#rules",
    author: "Moderator",
    replies: 0,
    views: 52100,
    pinned: true,
    locked: true,
  },
  {
    id: "2",
    title: "My room echoes, even with foam",
    href: "#t2",
    author: "Dimas",
    replies: 37,
    views: 2290,
    tags: ["room"],
    last: { author: "Citra Dewi", time: "1 h ago" },
  },
  {
    id: "3",
    title: "Show your desk setup, November thread",
    href: "#t3",
    author: "Eka Lestari",
    replies: 1520,
    views: 96300,
    pinned: true,
    tags: ["setup"],
    last: { author: "Fajar", time: "3 h ago" },
  },
  {
    id: "4",
    title: "Free tools to level two voices?",
    href: "#t4",
    author: "Fajar Nugroho",
    replies: 8,
    views: 410,
    tags: ["editing"],
    last: { author: "Ana Putri", time: "yesterday" },
  },
];
</script>

<template>
  <BlessForumTopics :topics />
</template>
