<script setup lang="ts">
import { ref } from "vue";
import { BlessSortable } from "blessing-ui";
const tiles = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
</script>

<template>
  <div style="max-width: 420px">
    <BlessSortable v-model="tiles" :columns="3" label="Days" :row-key="(t: string) => t" />
  </div>
</template>
