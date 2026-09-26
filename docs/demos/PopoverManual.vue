<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessPopover } from "blessing-ui";
const open = ref(false);
</script>

<template>
  <BlessPopover v-model:open="open" modal title="Manual (modal)">
    <template #trigger
      ><BlessButton>manual, open = {{ open }}</BlessButton></template
    >
    <template #default="{ close }"
      >No light dismiss. <BlessButton size="sm" @click="close">close</BlessButton></template
    >
  </BlessPopover>
</template>
