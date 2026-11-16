<script setup lang="ts">
import { ref } from "vue";
import { BlessShareBar } from "blessing-ui";

const url = "https://example.com/episodes/41";
const last = ref("");
</script>

<template>
  <BlessShareBar
    :url
    title="Episode 41: the final edit"
    :targets="[
      { label: 'Email', href: `mailto:?subject=Episode%2041&body=${encodeURIComponent(url)}` },
    ]"
    @shared="(how) => (last = how)"
  />
  <p v-if="last" style="margin-top: 12px">Shared by: {{ last }}</p>
</template>
