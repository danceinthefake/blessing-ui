<script setup lang="ts">
import { BlessSkeleton } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessSkeleton avatar width="56px" height="56px" />
    <div style="flex: 1; max-width: 320px"><BlessSkeleton :lines="3" height="12px" /></div>
    <BlessSkeleton width="120px" height="40px" />
  </div>
</template>
