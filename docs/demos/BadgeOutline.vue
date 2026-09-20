<script setup lang="ts">
import { BlessBadge, BlessText } from "blessing-ui";
</script>

<template>
  <div class="col">
    <div class="row">
      <BlessBadge variant="outline" :scaled="false">企画</BlessBadge>
      <BlessBadge variant="outline" :scaled="false">サブディレクター</BlessBadge>
      <BlessBadge variant="outline" color="accent" :scaled="false">メインヒロイン</BlessBadge>
    </div>
    <div class="row">
      <BlessBadge variant="outline" color="text" :scaled="false">text</BlessBadge>
      <BlessBadge variant="outline" color="danger" :scaled="false">danger</BlessBadge>
      <BlessBadge variant="outline" color="info" :scaled="false">info</BlessBadge>
      <BlessBadge variant="outline">NEW!</BlessBadge>
    </div>
    <BlessText size="xs" muted
      >Quiet role / category tags. Solid badges shout; these label.</BlessText
    >
  </div>
</template>
