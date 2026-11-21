<template>
  <BlessRecordHeader
    title="Studio gear order"
    code="PO-2026-0142"
    status="Waiting for approval"
    color="warning"
    :level="2"
    :facts="[
      { label: 'Supplier', value: 'Toko Audio Jaya' },
      { label: 'Order date', value: '14 Nov 2026' },
      { label: 'Due', value: '21 Nov 2026' },
      { label: 'Total', value: 'Rp 4.200.000' },
      { label: 'Owner', value: 'Budi Santoso' },
    ]"
  >
    <BlessButton size="sm">Approve</BlessButton>
    <BlessButton size="sm" variant="outline">Edit</BlessButton>
  </BlessRecordHeader>
</template>

<script setup lang="ts">
import { BlessButton, BlessRecordHeader } from "blessing-ui";
</script>
