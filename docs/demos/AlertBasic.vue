<script setup lang="ts">
import { ref } from "vue";
import { BlessAlert, BlessButton } from "blessing-ui";
const open = ref(true);
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessAlert v-model="open" title="Blu-ray BOX" color="accent" dismissible>
      2019.09.25 発売。<template #icon>★</template>
    </BlessAlert>
    <BlessAlert title="Heads up" color="warning">Tickets sell out fast.</BlessAlert>
    <BlessAlert color="danger" live="alert">Payment failed. Try again.</BlessAlert>
    <BlessAlert color="success">Saved.</BlessAlert>
    <BlessAlert color="info" title="Info" dismissible>Info with dismiss, no v-model.</BlessAlert>
    <BlessButton v-if="!open" size="sm" @click="open = true">show again</BlessButton>
  </div>
</template>
