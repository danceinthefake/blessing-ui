<template>
  <div class="row" style="align-items: flex-start">
    <BlessEmojiPicker v-model:recent="recent" @select="message += $event.char" />
    <div class="col">
      <BlessTextarea v-model="message" aria-label="Message" :rows="3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessEmojiPicker, BlessTextarea } from "blessing-ui";

const message = ref("Episode 12 tonight ");
const recent = ref<string[]>(["🎉", "👍"]);
</script>
