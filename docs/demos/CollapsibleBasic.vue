<script setup lang="ts">
import { ref } from "vue";
import { BlessCollapsible } from "blessing-ui";
const open = ref(false);
</script>

<template>
  <div class="col">
    <BlessCollapsible v-model:open="open" title="Standalone collapsible"
      >Native &lt;details&gt;; open = {{ open }}</BlessCollapsible
    >
    <BlessCollapsible title="Disabled" disabled>hidden</BlessCollapsible>
  </div>
</template>
