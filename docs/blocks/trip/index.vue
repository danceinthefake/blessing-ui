<template>
  <div class="trip">
    <BlessPlaceSearch
      v-model="place"
      :search="mockTripApi.search"
      :labels="{ placeholder: 'Tokyo, Kyoto, or Jakarta' }"
    />
    <template v-if="city">
      <BlessText as="h2" size="lg" weight="bold" class="trip__city"
        >{{ city.name }}, {{ city.address }}</BlessText
      >
      <div class="trip__row">
        <BlessWeatherForecast
          :place="city.name"
          :temp="city.now.temp"
          :weather="city.now.weather"
          :humidity="city.now.humidity"
          :wind="city.now.wind"
          :days="city.days"
        />
        <BlessWorldClock :zones />
      </div>
      <section aria-labelledby="trip-places">
        <BlessText id="trip-places" as="h3" size="sm" weight="bold">Places to visit</BlessText>
        <BlessMapPins
          :key="city.id"
          v-model:center="center"
          v-model:selected="selected"
          v-model:zoom="zoom"
          :pins="city.pins"
          :height="300"
        />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  BlessMapPins,
  BlessPlaceSearch,
  BlessText,
  BlessWeatherForecast,
  BlessWorldClock,
  type BlessPlace,
} from "blessing-ui";
import { computed, onMounted, ref, watch } from "vue";
import { mockTripApi } from "./api";
import type { City } from "./domain";

const place = ref<BlessPlace | null>(null);
const city = ref<City>();
// the search returns whole cities, so the chosen place is one of them
watch(place, (p) => p && (city.value = p as City));
onMounted(async () => (city.value = (await mockTripApi.search("tokyo"))[0]));
const zones = computed(() =>
  city.value
    ? [
        { zone: "Asia/Jakarta", label: "Home" },
        { zone: city.value.zone, label: city.value.name },
      ]
    : [],
);
const center = ref<[number, number]>([0, 0]);
const selected = ref<string>();
const zoom = ref(11);
watch(city, (c) => c && ((center.value = c.center), (selected.value = undefined)));
</script>

<style scoped>
.trip {
  display: grid;
  gap: var(--bless-space-5);
  padding: var(--bless-space-6);
  max-width: 960px;
}
.trip__city,
.trip h3 {
  margin: 0 0 var(--bless-space-2);
}
.trip__row {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: var(--bless-space-5);
  align-items: start;
}
@media (max-width: 760px) {
  .trip {
    padding: var(--bless-space-4);
  }
  .trip__row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
