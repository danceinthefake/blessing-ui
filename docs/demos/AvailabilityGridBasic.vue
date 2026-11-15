<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessAvailabilityGrid, BlessText } from "blessing-ui";

// when the guest is free next week, to record an episode
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const free = ref(["Tue 10:00", "Tue 10:30", "Tue 11:00", "Thu 14:00", "Thu 14:30"]);
const hours = computed(() => free.value.length / 2);
</script>

<template>
  <div style="max-width: 560px">
    <BlessAvailabilityGrid v-model="free" :days :day-start="9" :day-end="17" locale="en" />
    <BlessText as="p" size="sm" style="margin-top: 12px">Free: {{ hours }} hours</BlessText>
  </div>
</template>
