<template>
  <BlessNotificationPrefs v-model="prefs" :events :channels style="max-width: 560px" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessNotificationPrefs } from "blessing-ui";

const events = [
  { key: "episode", label: "New episode", description: "A show you follow posts an episode" },
  { key: "reply", label: "Reply to you", description: "Someone answers your comment" },
  { key: "mention", label: "Mention", description: "Someone names you in a comment" },
  { key: "digest", label: "Weekly digest", description: "The best episodes of the week" },
];
const channels = [
  { key: "email", label: "Email" },
  { key: "push", label: "Push" },
  { key: "sms", label: "SMS" },
];
const prefs = ref<Record<string, string[]>>({
  episode: ["email", "push"],
  reply: ["push"],
  mention: ["push"],
  digest: ["email"],
});
</script>
