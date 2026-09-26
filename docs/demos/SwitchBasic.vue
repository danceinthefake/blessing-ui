<script setup lang="ts">
import { ref } from "vue";
import { BlessSwitch } from "blessing-ui";
const notify = ref(true);
const autoplay = ref(false);
const subs = ref(true);
</script>

<template>
  <div class="row">
    <BlessSwitch v-model="notify">Notifications</BlessSwitch>
    <BlessSwitch v-model="autoplay" size="sm">Autoplay</BlessSwitch>
    <BlessSwitch v-model="subs" label-position="start">Subtitles</BlessSwitch>
    <BlessSwitch disabled :model-value="true">Sync (managed)</BlessSwitch>
  </div>
</template>
