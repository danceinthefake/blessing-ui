<script setup lang="ts">
import { BlessDeferredContent, BlessSkeleton, BlessText } from "blessing-ui";
import { shots } from "./_data";
</script>

<template>
  <div class="col" style="max-width: 320px">
    <BlessText size="xs" muted>image below mounts only when within 200px of the viewport</BlessText>
    <BlessDeferredContent min-height="200px">
      <img
        :src="shots[3].src"
        alt=""
        style="display: block; width: 100%; height: 200px; object-fit: cover"
      />
      <template #placeholder><BlessSkeleton height="200px" /></template>
    </BlessDeferredContent>
  </div>
</template>
