<script setup lang="ts">
import { BlessCopyButton } from "blessing-ui";
</script>

<template>
  <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
    <code>npm install blessing-ui</code>
    <BlessCopyButton value="npm install blessing-ui" />
    <BlessCopyButton value="npm install blessing-ui" variant="ghost" size="sm" />
  </div>
</template>
