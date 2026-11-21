<template>
  <BlessMapPins v-model:center="center" v-model:zoom="zoom" v-model:selected="selected" :pins />
  <div style="margin-top: 12px">{{ picked ? `Selected: ${picked.label}` : "Select a pin." }}</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessMapPins, type BlessMapPin } from "blessing-ui";

const pins: BlessMapPin[] = [
  { id: "monas", lat: -6.1754, lng: 106.8272, label: "Monas" },
  { id: "store", lat: -6.1862, lng: 106.8227, label: "Studio store" },
  { id: "kota", lat: -6.1352, lng: 106.8133, label: "Kota Tua" },
  { id: "senayan", lat: -6.2186, lng: 106.8022, label: "Senayan" },
];
const center = ref<[number, number]>([-6.18, 106.82]);
const zoom = ref(12);
const selected = ref<string>();
const picked = computed(() => pins.find((p) => p.id === selected.value));
</script>
