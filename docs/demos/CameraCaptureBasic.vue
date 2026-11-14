<script setup lang="ts">
import { ref } from "vue";
import { BlessCameraCapture } from "blessing-ui";

// in an app, upload the blob, for example as a profile photo
const size = ref<number>();
</script>

<template>
  <div class="col" style="max-width: 28rem">
    <BlessCameraCapture @capture="size = $event.size" />
    <p v-if="size" style="margin: 0; font-size: 0.875rem">Got {{ size }} bytes to upload.</p>
  </div>
</template>
