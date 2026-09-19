<script setup lang="ts">
import { BlessButton, BlessInput, BlessToolbar, BlessSeparator, BlessAvatar } from "blessing-ui";
</script>

<template>
  <BlessToolbar label="Editor">
    <template #start>
      <BlessButton size="sm">New</BlessButton>
      <BlessButton size="sm" variant="outline">Open</BlessButton>
      <BlessSeparator orientation="vertical" style="height: 24px" />
      <BlessButton size="sm" variant="ghost">Share</BlessButton>
    </template>
    <template #center><BlessInput size="sm" placeholder="search…" style="width: 220px" /></template>
    <template #end><BlessAvatar name="Megumi Kato" size="sm" /></template>
  </BlessToolbar>
</template>
