<script setup lang="ts">
import { BlessArticleHeader } from "blessing-ui";
</script>

<template>
  <!-- level 2 here, because the docs page already has an h1 -->
  <BlessArticleHeader
    :level="2"
    topic="Home recording"
    topic-href="#home-recording"
    title="Your wardrobe is the best vocal booth you already own"
    summary="Soft things stop echo. Before you buy foam, try the room that is full of clothes."
    :author="{ name: 'Ana Putri', href: '#ana' }"
    date="2026-11-16"
    updated="2026-11-17"
    :minutes="6"
    style="max-width: 640px"
  />
</template>
