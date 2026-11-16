<script setup lang="ts">
import { ref } from "vue";
import { BlessThermostat, type BlessThermostatMode } from "blessing-ui";

const target = ref(22.5);
const mode = ref<BlessThermostatMode>("auto");
</script>

<template>
  <BlessThermostat v-model="target" v-model:mode="mode" :current="25.5" />
</template>
