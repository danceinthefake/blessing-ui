<script setup lang="ts">
import { ref } from "vue";
import { BlessDeliveryPicker, type BlessDeliveryDay } from "blessing-ui";

const w = (id: string, start: string, end: string, fee: number, full = false) => ({
  id,
  start,
  end,
  fee,
  full,
});
const days: BlessDeliveryDay[] = [
  {
    date: "2026-11-16",
    windows: [w("16a", "09:00", "12:00", 15000, true), w("16b", "18:00", "21:00", 25000, true)],
  },
  {
    date: "2026-11-17",
    windows: [
      w("17a", "09:00", "12:00", 0),
      w("17b", "13:00", "17:00", 10000),
      w("17c", "18:00", "21:00", 25000, true),
    ],
  },
  {
    date: "2026-11-18",
    windows: [
      w("18a", "09:00", "12:00", 0),
      w("18b", "13:00", "17:00", 10000),
      w("18c", "18:00", "21:00", 25000),
    ],
  },
  {
    date: "2026-11-19",
    windows: [w("19a", "09:00", "12:00", 0), w("19b", "18:00", "21:00", 25000)],
  },
];
const slot = ref<string>();
</script>

<template>
  <BlessDeliveryPicker
    v-model="slot"
    :days
    currency="IDR"
    locale="id-ID"
    style="max-width: 520px"
  />
  <p style="margin-top: 12px">Chosen window: {{ slot ?? "none yet" }}</p>
</template>
