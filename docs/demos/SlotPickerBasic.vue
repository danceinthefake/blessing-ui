<template>
  <div style="max-width: 480px">
    <BlessSlotPicker v-model="time" :slots locale="en" />
    <BlessText as="p" size="sm" style="margin-top: 12px">
      {{ time ? `Picked: ${time}` : "Pick a time for the call." }}
    </BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessSlotPicker, BlessText, type BlessSlot } from "blessing-ui";

// free times for a 30-minute call with the host; some are taken
const slots: BlessSlot[] = [
  { time: "09:00" },
  { time: "09:30", disabled: true },
  { time: "10:00" },
  { time: "11:30" },
  { time: "13:00" },
  { time: "13:30", disabled: true },
  { time: "15:00" },
  { time: "16:30" },
  { time: "19:00" },
  { time: "19:30" },
];
const time = ref<string | null>(null);
</script>
