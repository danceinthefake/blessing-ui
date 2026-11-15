<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessShipmentTracker } from "blessing-ui";

const late = ref(false);
const events = [
  { time: "14 Nov, 09:12", text: "Out for delivery with the courier", place: "Jakarta Selatan" },
  { time: "13 Nov, 20:40", text: "Arrived at the delivery hub", place: "Jakarta" },
  { time: "12 Nov, 16:05", text: "Left the warehouse", place: "Bandung" },
  { time: "11 Nov, 10:30", text: "Packed and labeled", place: "Bandung" },
];
</script>

<template>
  <div style="max-width: 560px; display: flex; flex-direction: column; gap: 16px">
    <BlessButton size="sm" variant="outline" style="align-self: flex-start" @click="late = !late">
      {{ late ? "Hide the problem" : "Show a problem" }}
    </BlessButton>
    <BlessShipmentTracker
      :stage="3"
      :dates="['10 Nov', '11 Nov', '12 Nov', '14 Nov']"
      :events
      :problem="
        late ? 'The courier could not find the house. They will try again tomorrow.' : undefined
      "
      carrier="JNE"
      tracking="JN0041 2026 1115"
      tracking-url="#"
    />
  </div>
</template>
