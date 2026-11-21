<template>
  <div style="display: grid; gap: 10px; justify-items: start">
    <BlessReadReceipt status="sending" time="09:14" />
    <BlessReadReceipt status="sent" time="09:12" />
    <BlessReadReceipt status="delivered" time="09:10" />
    <BlessReadReceipt status="read" time="09:02" />
    <BlessReadReceipt status="read" time="08:55" :read-by="['Ana', 'Budi', 'Citra']" />
    <BlessReadReceipt :status="retried" time="08:50" @retry="retried = 'sending'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessReadReceipt, type BlessReceiptStatus } from "blessing-ui";

const retried = ref<BlessReceiptStatus>("failed");
</script>
