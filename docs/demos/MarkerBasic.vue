<script setup lang="ts">
import { BlessMarker } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessMarker>status pill</BlessMarker>
    <BlessMarker variant="note" color="info"
      ><template #icon>ℹ</template>note, muted line</BlessMarker
    >
    <BlessMarker variant="separator">separator</BlessMarker>
    <BlessMarker variant="border" color="danger"
      ><template #icon>⚠</template>border row, danger</BlessMarker
    >
    <BlessMarker shimmer>shimmer while pending</BlessMarker>
  </div>
</template>
