<script setup lang="ts">
import { BlessButton, useLoadingBar } from "blessing-ui";
// <BlessLoadingBar /> is mounted once at the app root (this site does it in the theme layout)
const bar = useLoadingBar();
const fake = () => bar.track(new Promise((r) => setTimeout(r, 1800)));
const brief = () => (bar.start(), setTimeout(bar.stop, 800));
</script>

<template>
  <div class="row">
    <BlessButton @click="fake">Track a 1.8s request</BlessButton>
    <BlessButton variant="outline" @click="brief">Track a 0.8s request</BlessButton>
    <small>watch the top edge of the page</small>
  </div>
</template>
