<script setup lang="ts">
import { BlessButton, useToast } from "blessing-ui";
// <BlessToaster /> is mounted once at the app root (this site does it in the theme layout)
const { toast, success, error, warning, info } = useToast();
const reload = () => location.reload();
</script>

<template>
  <div class="row">
    <BlessButton size="sm" @click="toast('Plain toast')">toast</BlessButton>
    <BlessButton size="sm" @click="success({ title: 'Saved', description: '2 fields updated' })"
      >success</BlessButton
    >
    <BlessButton
      size="sm"
      @click="error({ title: 'Failed', description: 'Network error', duration: 0 })"
      >error (sticky)</BlessButton
    >
    <BlessButton size="sm" @click="warning('Low disk space')">warning</BlessButton>
    <BlessButton
      size="sm"
      @click="info({ title: 'Update', action: { label: 'Reload', onClick: reload } })"
      >info + action</BlessButton
    >
  </div>
</template>
