<template>
  <div style="max-width: 280px">
    <BlessFacetFilter
      v-model="selected"
      v-model:price="price"
      :facets
      price-range
      currency="IDR"
      locale="id-ID"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessFacetFilter, type BlessFacet } from "blessing-ui";

// the filters of a shop that sells recording gear; the counts come from the search
const facets: BlessFacet[] = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "usb", label: "USB microphones", count: 18 },
      { value: "xlr", label: "XLR microphones", count: 26 },
      { value: "headphones", label: "Headphones", count: 12 },
      { value: "interfaces", label: "Audio interfaces", count: 0 },
    ],
  },
  {
    id: "pattern",
    label: "Pickup pattern",
    options: [
      { value: "cardioid", label: "Cardioid", count: 31 },
      { value: "omni", label: "Omnidirectional", count: 7 },
      { value: "figure8", label: "Figure 8", count: 3 },
    ],
  },
];
const selected = ref<Record<string, string[]>>({ type: ["usb"] });
const price = ref<[number | undefined, number | undefined]>([undefined, 1500000]);
</script>
