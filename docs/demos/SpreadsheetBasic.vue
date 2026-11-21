<template>
  <div style="max-width: 100%">
    <BlessSpreadsheet
      v-model="rows"
      :columns="['Episode', 'Title', 'Plays', 'Minutes']"
      label="Plays of each episode"
    />
    <BlessText as="p" size="sm" style="margin-top: 12px">Total plays: {{ total }}</BlessText>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessSpreadsheet, BlessText } from "blessing-ui";

const rows = ref([
  ["Ep. 41", "Home studio", "1240", "38"],
  ["Ep. 40", "Guest: Budi", "1105", "41"],
  ["Ep. 39", "Mic test", "980", "29"],
  ["Ep. 38", "Listener Q&A", "1310", "45"],
]);
const total = computed(() => rows.value.reduce((n, r) => n + (Number(r[2]) || 0), 0));
</script>
