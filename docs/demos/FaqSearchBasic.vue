<template>
  <BlessFaqSearch :items style="max-width: 560px" />
</template>

<script setup lang="ts">
import { BlessFaqSearch } from "blessing-ui";

const items = [
  {
    question: "Which microphone do you use?",
    answer: "A USB microphone that costs less than $100, in front of a wardrobe full of coats.",
  },
  {
    question: "How long is an episode?",
    answer: "Most episodes are 40 to 50 minutes. Solo episodes are about 20.",
  },
  {
    question: "When do new episodes come out?",
    answer: "Every Monday at 6:00 in the morning, Jakarta time.",
  },
  {
    question: "Can I be a guest?",
    answer: "Yes. Write to us with your topic and a short sample of your voice.",
  },
  {
    question: "Do you have a transcript?",
    answer: "Each episode page has a full transcript under the player.",
  },
  {
    question: "How can I support the show?",
    answer: "Tell a friend, or join the listener club for early episodes.",
  },
];
</script>
