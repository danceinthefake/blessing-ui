<script setup lang="ts">
import { ref } from "vue";
import { BlessQuestionnaire, type BlessAnswers, type BlessQuestion } from "blessing-ui";
const questions: BlessQuestion[] = [
  {
    name: "heroine",
    title: "Who is the main heroine?",
    description: "One answer.",
    type: "single",
    choices: [
      { value: "megumi", label: "Megumi", description: "flat, but…" },
      { value: "eriri", label: "Eriri" },
      { value: "utaha", label: "Utaha" },
    ],
  },
  {
    name: "watched",
    title: "Which have you watched?",
    type: "multiple",
    choices: [
      { value: "s1", label: "Season 1" },
      { value: "s2", label: "♭" },
      { value: "fine", label: "Fine" },
    ],
  },
  {
    name: "note",
    title: "Anything else?",
    type: "freeform",
    skippable: true,
    required: false,
    placeholder: "optional",
  },
];
const answers = ref<BlessAnswers>({});
const submitted = ref<BlessAnswers>();
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessQuestionnaire v-model="answers" :questions @submit="submitted = $event" />
    <pre style="font-size: 12px; margin: 0">{{ submitted ?? answers }}</pre>
  </div>
</template>
