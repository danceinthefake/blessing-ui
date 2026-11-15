<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessProfileCard } from "blessing-ui";

const following = ref(false);
const stats = [
  { label: "followers", value: 12_480 },
  { label: "episodes", value: 41 },
  { label: "hours on air", value: 63 },
];
</script>

<template>
  <BlessProfileCard
    v-model:following="following"
    name="Ana Putri"
    handle="@ana.records"
    href="#"
    bio="Host of Home Studio, a weekly show about good sound on a small budget. Records from a wardrobe in Bandung."
    :stats
    followable
    style="max-width: 360px"
  >
    <template #actions>
      <BlessButton size="sm" variant="ghost">Message</BlessButton>
    </template>
  </BlessProfileCard>
</template>
