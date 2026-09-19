<script setup lang="ts">
import { BlessSeparator } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessSeparator />
    <div class="row" style="height: 40px; align-items: stretch">
      <span>left</span><BlessSeparator orientation="vertical" color="rule" /><span>right</span>
    </div>
    <BlessSeparator label="or" color="accent" />
  </div>
</template>
