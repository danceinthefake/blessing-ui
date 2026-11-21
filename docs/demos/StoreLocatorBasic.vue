<template>
  <BlessStoreLocator v-model="pickup" :stores style="max-width: 440px" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessStoreLocator, type BlessStore } from "blessing-ui";

// made-up stores; the distances come from your server or from the Geolocation API
const stores: BlessStore[] = [
  {
    id: "kemang",
    name: "Home Studio Kemang",
    address: "Jl. Kemang Raya 12, Jakarta Selatan",
    distance: 2.4,
    open: true,
    hours: "10:00–21:00",
    phone: "+62 21 555 0101",
    directions: "#directions-kemang",
  },
  {
    id: "menteng",
    name: "Home Studio Menteng",
    address: "Jl. Cikini Raya 7, Jakarta Pusat",
    distance: 6.8,
    open: true,
    hours: "09:00–20:00",
    directions: "#directions-menteng",
  },
  {
    id: "bsd",
    name: "Home Studio BSD",
    address: "Jl. Pahlawan Seribu 3, Tangerang Selatan",
    distance: 21.5,
    open: false,
    hours: "opens 11:00",
    phone: "+62 21 555 0303",
  },
];
const pickup = ref("kemang");
</script>
