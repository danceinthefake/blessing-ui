<template>
  <div class="col">
    <BlessAudioRecorder :max-duration="60" @record="size = $event.size" />
    <p v-if="size" style="margin: 0; font-size: 0.875rem">Got {{ size }} bytes to upload.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessAudioRecorder } from "blessing-ui";

// in an app, upload the blob, for example with FormData
const size = ref<number>();
</script>
