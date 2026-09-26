<script setup lang="ts">
import { ref } from "vue";
import { BlessBlockUI, BlessButton, BlessPanel } from "blessing-ui";
const busy = ref(false);
function rerun() {
  busy.value = true;
  setTimeout(() => (busy.value = false), 1500);
}
</script>

<template>
  <div class="col" style="max-width: 360px">
    <BlessBlockUI :blocked="busy">
      <BlessPanel title="Weekly report">
        <p style="margin: 0 0 8px">Viewers 12,480 · Completion 71% · Shares 3,112</p>
        <BlessButton size="sm" variant="outline">Export</BlessButton>
      </BlessPanel>
    </BlessBlockUI>
    <div class="row">
      <BlessButton size="sm" @click="rerun">Re-run report</BlessButton>
    </div>
  </div>
</template>
