<template>
  <BlessEligibilityCheck :questions :outcomes />
</template>

<script setup lang="ts">
import {
  BlessEligibilityCheck,
  type BlessEligibilityOutcome,
  type BlessEligibilityQuestion,
} from "blessing-ui";

const questions: BlessEligibilityQuestion[] = [
  {
    id: "kind",
    text: "What kind of business do you run?",
    options: [
      { label: "A small shop or a studio", next: "staff" },
      { label: "A factory", next: "factory" },
    ],
  },
  {
    id: "staff",
    text: "How many people work for you?",
    hint: "Count yourself and part-time staff.",
    options: [
      { label: "1 to 19", next: "income" },
      { label: "20 or more", next: "big" },
    ],
  },
  {
    id: "income",
    text: "Was your income last year under Rp 2.5 billion?",
    options: [
      { label: "Yes", next: "ok" },
      { label: "No", next: "big" },
    ],
  },
];
const outcomes: BlessEligibilityOutcome[] = [
  {
    id: "ok",
    title: "You can apply for the small business grant",
    body: "The grant pays up to Rp 25 million for tools and training. Have your business licence and your tax number ready.",
    eligible: true,
    href: "#apply",
    cta: "Start your request",
  },
  {
    id: "big",
    title: "The grant is for small businesses only",
    body: "A business loan with a low rate can help you instead.",
    eligible: false,
    href: "#loans",
    cta: "See business loans",
  },
  {
    id: "factory",
    title: "Factories apply through the industry office",
    body: "The industry office has its own support for factories.",
    eligible: false,
  },
];
</script>
