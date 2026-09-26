<script setup lang="ts">
import { BlessBadge } from "blessing-ui";
</script>

<template>
  <div class="col">
    <div class="row">
      <BlessBadge variant="outline">企画</BlessBadge>
      <BlessBadge variant="outline">サブディレクター</BlessBadge>
      <BlessBadge variant="outline">メインヒロイン</BlessBadge>
    </div>
    <div class="row">
      <BlessBadge variant="outline" color="text">text</BlessBadge>
      <BlessBadge variant="outline" color="danger">danger</BlessBadge>
      <BlessBadge variant="outline" color="info">info</BlessBadge>
      <BlessBadge variant="outline">NEW!</BlessBadge>
    </div>
  </div>
</template>
