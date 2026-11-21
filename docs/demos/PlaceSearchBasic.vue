<template>
  <div style="min-block-size: 22rem">
    <BlessPlaceSearch v-model="place" :search />
    <div style="margin-top: 12px">
      {{ place ? `Chosen: ${place.name}` : "Type kopi, studio, or pasar." }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPlaceSearch, type BlessPlace } from "blessing-ui";

// a pretend place service; call your own, such as a geocoder, in search
const all: BlessPlace[] = [
  {
    id: "1",
    name: "Kopi Tuku Cipete",
    kind: "Cafe",
    address: "Jl. Cipete Raya 7, Jakarta Selatan",
    distance: 450,
  },
  {
    id: "2",
    name: "Kopi Kenangan Senopati",
    kind: "Cafe",
    address: "Jl. Senopati 31, Jakarta Selatan",
    distance: 2300,
  },
  {
    id: "3",
    name: "Stasiun Sudirman",
    kind: "Station",
    address: "Jl. Kendal, Jakarta Pusat",
    distance: 5100,
  },
  {
    id: "4",
    name: "Studio Bunyi",
    kind: "Recording studio",
    address: "Jl. Kemang Raya 12, Jakarta Selatan",
    distance: 1250,
  },
  {
    id: "5",
    name: "Pasar Santa",
    kind: "Market",
    address: "Jl. Cisanggiri II, Jakarta Selatan",
    distance: 1800,
  },
];
const search = (q: string) =>
  new Promise<BlessPlace[]>((done) =>
    setTimeout(
      () => done(all.filter((p) => `${p.name} ${p.kind}`.toLowerCase().includes(q.toLowerCase()))),
      300,
    ),
  );
const place = ref<BlessPlace | null>(null);
</script>
