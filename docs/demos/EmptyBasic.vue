<script setup lang="ts">
import { BlessButton, BlessEmpty } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessEmpty title="No episodes yet" description="New episodes appear here after broadcast.">
      <template #icon>∅</template>
      <BlessButton size="sm">Browse</BlessButton>
      <BlessButton variant="ghost" size="sm">Refresh</BlessButton>
    </BlessEmpty>
    <BlessEmpty variant="plain" title="No episodes match “eriri ep.13”">
      <BlessButton variant="ghost" size="sm">Clear search</BlessButton>
    </BlessEmpty>
  </div>
</template>
