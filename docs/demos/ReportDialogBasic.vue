<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessReportDialog } from "blessing-ui";

const open = ref(false);
const sent = ref("");
</script>

<template>
  <BlessButton variant="outline" @click="open = true">Report this comment</BlessButton>
  <BlessReportDialog
    v-model:open="open"
    subject="this comment"
    @report="(reason, note) => (sent = note ? `${reason}: ${note}` : reason)"
  />
  <p v-if="sent" style="margin-top: 12px">Report sent: {{ sent }}</p>
</template>
