<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCoachmark } from "blessing-ui";

const seen = ref(false);
const log = ref("");
</script>

<template>
  <div class="row" style="padding-block: 16px">
    <BlessCoachmark
      v-model:dismissed="seen"
      text="Export to PDF is here now."
      @dismiss="log = 'Marked as seen.'"
    >
      <BlessButton variant="outline">Export</BlessButton>
    </BlessCoachmark>
    <BlessButton size="sm" variant="ghost" @click="((seen = false), (log = ''))"
      >Show again</BlessButton
    >
    <span aria-live="polite">{{ log }}</span>
  </div>
</template>
