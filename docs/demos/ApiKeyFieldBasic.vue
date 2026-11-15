<script setup lang="ts">
import { ref } from "vue";
import { BlessApiKeyField } from "blessing-ui";

// a made-up key; on a real page it comes from your server
const key = ref("sk_demo_7Hq2LmN4pX9rT6vW1zB3cD5f");
const made = ref("3 Nov 2026");
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function regenerate() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  key.value = `sk_demo_${[...bytes].map((b) => letters[b % letters.length]).join("")}`;
  made.value = "just now";
}
</script>

<template>
  <BlessApiKeyField
    :value="key"
    name="Upload script"
    :created="made"
    last-used="2 hours ago"
    style="max-width: 560px"
    @regenerate="regenerate"
  />
</template>
