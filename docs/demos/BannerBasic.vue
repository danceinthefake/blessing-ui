<script setup lang="ts">
import { BlessBanner, BlessButton } from "blessing-ui";
</script>

<template>
  <div style="display: grid; gap: 1rem">
    <BlessBanner>
      Version 0.4 is out.
      <template #action
        ><BlessButton size="sm" variant="outline" href="#">Read more</BlessButton></template
      >
    </BlessBanner>
    <BlessBanner color="warning">Planned maintenance on Friday, 02:00 UTC.</BlessBanner>
    <BlessBanner color="danger" persist="bless-demo-banner">
      You can dismiss this one. It stays gone on your next visit.
    </BlessBanner>
  </div>
</template>
