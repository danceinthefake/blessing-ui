<script setup lang="ts">
import { BlessClientOnly, BlessSkeleton } from "blessing-ui";
// only the browser knows these; the server would render something else
const here = () => `${navigator.language} · ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
</script>

<template>
  <BlessClientOnly>
    <p style="margin: 0; line-height: 20px">Your locale and time zone: {{ here() }}</p>
    <template #fallback><BlessSkeleton width="280px" height="20px" /></template>
  </BlessClientOnly>
</template>
