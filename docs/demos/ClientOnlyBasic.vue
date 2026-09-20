<script setup lang="ts">
import { BlessClientOnly, BlessSkeleton } from "blessing-ui";
const ua = () => navigator.userAgent.split(" ").at(-1);
</script>

<template>
  <BlessClientOnly>
    <p>Rendered in the browser: {{ ua() }}</p>
    <template #fallback><BlessSkeleton width="240px" height="20px" /></template>
  </BlessClientOnly>
</template>
