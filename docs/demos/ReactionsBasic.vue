<script setup lang="ts">
import { ref } from "vue";
import { BlessReactions, type BlessReaction } from "blessing-ui";

const reactions = ref<BlessReaction[]>([
  { emoji: "🔥", count: 24 },
  { emoji: "🎧", count: 9, active: true },
  { emoji: "😂", count: 5 },
  { emoji: "👏", count: 2 },
]);
</script>

<template>
  <div style="max-width: 560px">
    <p style="margin-top: 0">
      Episode 41 is out: we recorded it in a wardrobe, and it sounds better than the studio.
    </p>
    <BlessReactions v-model="reactions" />
  </div>
</template>
