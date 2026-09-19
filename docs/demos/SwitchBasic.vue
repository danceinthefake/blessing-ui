<script setup lang="ts">
import { ref } from "vue";
import { BlessSwitch } from "blessing-ui";
const on = ref(true);
</script>

<template>
  <div class="row">
    <BlessSwitch v-model="on">Notifications</BlessSwitch>
    <BlessSwitch size="sm" :model-value="false">Small</BlessSwitch>
    <BlessSwitch label-position="start" :model-value="true">Label first</BlessSwitch>
    <BlessSwitch disabled :model-value="true">Disabled</BlessSwitch>
  </div>
</template>
