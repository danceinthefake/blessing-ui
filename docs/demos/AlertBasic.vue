<script setup lang="ts">
import { ref } from "vue";
import { BlessAlert, BlessButton } from "blessing-ui";
const open = ref(true);
const failed = ref(false);
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessAlert v-model="open" title="Blu-ray BOX" color="accent" dismissible>
      2019.09.25 発売。<template #icon>★</template>
    </BlessAlert>
    <BlessAlert title="Heads up" color="warning">Tickets sell out fast.</BlessAlert>
    <BlessAlert v-if="failed" color="danger" live="alert">Payment failed. Try again.</BlessAlert>
    <BlessAlert color="success">Saved.</BlessAlert>
    <BlessAlert color="info" title="Info" dismissible>Info with dismiss, no v-model.</BlessAlert>
    <div class="row">
      <BlessButton v-if="!open" size="sm" @click="open = true">show again</BlessButton>
      <BlessButton size="sm" variant="outline" color="danger" @click="failed = !failed">{{
        failed ? "clear" : "fail a payment"
      }}</BlessButton>
    </div>
  </div>
</template>
