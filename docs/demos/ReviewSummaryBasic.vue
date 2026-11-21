<template>
  <div style="max-width: 560px">
    <BlessReviewSummary v-model:filter="filter" :counts="[812, 236, 74, 21, 39]" />
    <BlessText as="p" size="sm" style="margin-top: 12px">
      {{ filter ? `Showing the ${filter}-star reviews` : "Showing all reviews" }}
    </BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessReviewSummary, BlessText } from "blessing-ui";

const filter = ref<number>();
</script>
