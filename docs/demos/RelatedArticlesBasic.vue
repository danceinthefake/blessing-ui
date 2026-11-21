<template>
  <BlessRelatedArticles :articles :level="3" />
</template>

<script setup lang="ts">
import { BlessRelatedArticles, type BlessRelatedArticle } from "blessing-ui";
import { art } from "./_data";

const articles: BlessRelatedArticle[] = [
  {
    id: "mic",
    title: "How to pick your first microphone",
    href: "#mic",
    topic: "Gear",
    minutes: 7,
    image: art("🎙️", "f3e1e7"),
  },
  {
    id: "gain",
    title: "Set the gain once, and never clip again",
    href: "#gain",
    topic: "Recording",
    minutes: 4,
    image: art("🎚️", "dfe8f3"),
  },
  {
    id: "edit",
    title: "Edit an hour of talk in twenty minutes",
    href: "#edit",
    topic: "Editing",
    minutes: 9,
    image: art("✂️", "e8f3df"),
  },
];
</script>
