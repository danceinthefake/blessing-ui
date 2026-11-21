<template>
  <div class="col">
    <BlessInput v-model="q" type="search" aria-label="Search titles" placeholder="Try: cafe" />
    <ul style="margin: 0; padding-inline-start: 1.25rem">
      <li v-for="t in shown" :key="t"><BlessHighlight :text="t" :query="q" /></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessHighlight, BlessInput } from "blessing-ui";

const titles = [
  "Saenai Heroine no Sodatekata",
  "Saenai Heroine no Sodatekata ♭",
  "Saenai Heroine no Sodatekata Fine",
  "Café Terrace and Its Goddesses",
  "Pokémon Concierge",
];
const q = ref("heroine fine");
const words = computed(() => q.value.toLowerCase().split(/\s+/).filter(Boolean));
const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const shown = computed(() =>
  titles.filter((t) => words.value.some((w) => fold(t).includes(fold(w)))),
);
</script>
