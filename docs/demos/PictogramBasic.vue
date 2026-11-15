<script setup lang="ts">
import { BlessPictogram } from "blessing-ui";

// monthly listeners of the show in five cities
const cities = [
  { label: "Jakarta", value: 8_400 },
  { label: "Bandung", value: 5_100 },
  { label: "Surabaya", value: 3_700 },
  { label: "Yogyakarta", value: 2_900 },
  { label: "Medan", value: 1_250 },
];
</script>

<template>
  <BlessPictogram
    :data="cities"
    :unit="1000"
    noun="listeners"
    label="Monthly listeners by city"
    style="max-width: 560px"
  />
</template>
