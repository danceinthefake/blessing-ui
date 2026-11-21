<template>
  <BlessQuiz :questions />
</template>

<script setup lang="ts">
import { BlessQuiz } from "blessing-ui";

const questions = [
  {
    question: "Which room of a home sounds best for recording a voice?",
    choices: ["The bathroom", "A room with a full wardrobe", "The empty garage"],
    answer: 1,
    explain: "Soft things such as clothes stop the echo. Hard, empty rooms send the voice back.",
  },
  {
    question: "How loud should a podcast episode be?",
    choices: ["About −16 LUFS", "About −6 LUFS", "As loud as possible"],
    answer: 0,
    explain:
      "Most podcast apps play episodes at about −16 LUFS, so a louder file gets turned down.",
  },
  {
    question: "What does a pop filter stop?",
    choices: ["The hum of a computer", "Bursts of air from P and B sounds", "The echo of the room"],
    answer: 1,
  },
];
</script>
