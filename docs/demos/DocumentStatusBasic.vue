<template>
  <div style="display: grid; gap: 20px">
    <BlessDocumentStatus v-model="state" :states />
    <BlessDocumentStatus model-value="approved" :states stopped="Cancelled" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessDocumentStatus } from "blessing-ui";

const states = [
  { id: "draft", label: "Draft", time: "14 Nov, 10:02" },
  { id: "approved", label: "Approved", time: "15 Nov, 16:40" },
  { id: "sent", label: "Sent", time: "16 Nov, 09:00" },
  { id: "paid", label: "Paid" },
];
const state = ref("approved");
</script>
