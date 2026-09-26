<script setup lang="ts">
import { BlessButton, useToast } from "blessing-ui";
// <BlessToaster /> is mounted once at the app root (this site does it in the theme layout)
const { toast, success, error, warning, info } = useToast();
const reload = () => location.reload();
</script>

<template>
  <div class="row">
    <BlessButton size="sm" @click="toast('Link copied')">Copy link</BlessButton>
    <BlessButton size="sm" @click="success({ title: 'Saved', description: '2 fields updated' })"
      >Save</BlessButton
    >
    <BlessButton
      size="sm"
      @click="error({ title: 'Failed', description: 'Network error', duration: 0 })"
      >Sync (fails, stays)</BlessButton
    >
    <BlessButton size="sm" @click="warning('Low disk space')">Check storage</BlessButton>
    <BlessButton
      size="sm"
      @click="info({ title: 'Update', action: { label: 'Reload', onClick: reload } })"
      >New version</BlessButton
    >
  </div>
</template>
