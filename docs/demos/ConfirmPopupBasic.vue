<script setup lang="ts">
import { BlessButton, BlessConfirmPopup, useToast } from "blessing-ui";
const { success, info } = useToast();
</script>

<template>
  <div class="row">
    <BlessConfirmPopup
      message="Delete this episode? This cannot be undone."
      confirm-label="Delete"
      color="danger"
      @confirm="success('Deleted')"
      @cancel="info('Kept')"
    >
      <template #trigger
        ><BlessButton color="danger" variant="outline">Delete</BlessButton></template
      >
    </BlessConfirmPopup>
    <BlessConfirmPopup
      title="Publish"
      message="Make it visible to everyone?"
      placement="right"
      @confirm="success('Published')"
    >
      <template #trigger><BlessButton color="accent">Publish</BlessButton></template>
    </BlessConfirmPopup>
  </div>
</template>
