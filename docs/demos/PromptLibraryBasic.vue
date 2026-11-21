<template>
  <BlessPromptLibrary :prompts @use="used = $event" />
  <div v-if="used" style="margin-top: 12px">Sent to the chat: {{ used }}</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPromptLibrary, type BlessSavedPrompt } from "blessing-ui";

const prompts: BlessSavedPrompt[] = [
  {
    id: "1",
    title: "Reply to a customer",
    tags: ["email", "support"],
    text: "Write a short, kind reply to {{customer}} about {{problem}}. Offer {{offer}}. Sign as the Bunyi Studio team.",
  },
  {
    id: "2",
    title: "Show notes",
    tags: ["podcast", "writing"],
    text: "Write show notes for episode {{number}} with {{guest}}. Give 3 key points and 5 time stamps.",
  },
  {
    id: "3",
    title: "Product description",
    tags: ["shop", "writing"],
    text: "Describe the {{product}} for home recording artists in 80 words. Name one thing it does better than {{rival}}.",
  },
  {
    id: "4",
    title: "Weekly summary",
    tags: ["team"],
    text: "Summarize the notes below in 5 lines for the team meeting.",
  },
];
const used = ref("");
</script>
