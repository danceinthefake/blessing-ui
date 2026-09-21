<script setup lang="ts">
import { BlessBadge, BlessText } from "blessing-ui";
</script>

<template>
  <div class="col">
    <div class="row">
      <BlessBadge variant="outline">企画</BlessBadge>
      <BlessBadge variant="outline">サブディレクター</BlessBadge>
      <BlessBadge variant="outline" color="accent">メインヒロイン</BlessBadge>
    </div>
    <div class="row">
      <BlessBadge variant="outline" color="text">text</BlessBadge>
      <BlessBadge variant="outline" color="danger">danger</BlessBadge>
      <BlessBadge variant="outline" color="info">info</BlessBadge>
      <BlessBadge variant="outline">NEW!</BlessBadge>
    </div>
    <BlessText size="xs" muted
      >Quiet role / category tags. Solid badges shout; these label.</BlessText
    >
  </div>
</template>
