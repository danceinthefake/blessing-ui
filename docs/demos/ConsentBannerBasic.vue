<template>
  <div style="max-width: 560px">
    <BlessConsentBanner v-model="consent" :categories position="static" policy-href="#" />
    <template v-if="consent">
      <BlessText as="p" size="sm" style="margin-bottom: 8px"
        >Saved: {{ JSON.stringify(consent) }}</BlessText
      >
      <BlessButton size="sm" variant="outline" @click="consent = undefined">Ask again</BlessButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessConsentBanner, BlessText } from "blessing-ui";

const categories = [
  {
    key: "needed",
    label: "Needed",
    description: "Keep you signed in and remember this choice.",
    required: true,
  },
  {
    key: "stats",
    label: "Statistics",
    description: "Count which episodes people play, with no names.",
  },
  {
    key: "ads",
    label: "Sponsors",
    description: "Show sponsor messages that fit what you listen to.",
  },
];
// on a real page: leave out `position`, and add `persist` to keep the choice for the next visit
const consent = ref<Record<string, boolean>>();
</script>
