<script setup lang="ts">
import { BlessOeeGauge } from "blessing-ui";
</script>

<template>
  <!-- Press 1, this shift: 7.2 of 8 planned hours ran, at 94% of the ideal speed, with 97% good pieces -->
  <BlessOeeGauge :availability="0.9" :performance="0.94" :quality="0.97" style="max-width: 560px" />
</template>
