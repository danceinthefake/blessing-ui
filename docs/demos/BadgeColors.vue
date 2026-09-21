<script setup lang="ts">
import { BlessBadge } from "blessing-ui";
const colors = ["badge", "accent", "danger", "warning", "success", "info", "text"] as const;
</script>

<template>
  <div class="row">
    <BlessBadge v-for="c in colors" :key="c" :color="c">{{ c }}</BlessBadge>
  </div>
</template>
