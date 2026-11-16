<script setup lang="ts">
import { ref } from "vue";
import { BlessProductionCounter } from "blessing-ui";

const good = ref(142);
const scrap = ref(3);
</script>

<template>
  <BlessProductionCounter v-model:good="good" v-model:scrap="scrap" :target="200" />
</template>
