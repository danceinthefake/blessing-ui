<script setup lang="ts">
import { ref } from "vue";
import { BlessBlockUI, BlessButton, BlessPanel } from "blessing-ui";
const busy = ref(false);
function run() {
  busy.value = true;
  setTimeout(() => (busy.value = false), 1500);
}
</script>

<template>
  <div class="col" style="max-width: 360px">
    <BlessBlockUI :blocked="busy">
      <BlessPanel title="Report"
        >Content is inert while blocked — buttons and inputs inside can't be reached.<br /><BlessButton
          size="sm"
          style="margin-top: 8px"
          >inside</BlessButton
        ></BlessPanel
      >
    </BlessBlockUI>
    <BlessButton size="sm" @click="run">Block for 1.5s</BlessButton>
  </div>
</template>
