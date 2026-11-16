<script setup lang="ts">
import { ref } from "vue";
import { BlessWorkInstructions, type BlessInstructionStep } from "blessing-ui";
import { art } from "./_data";

const steps: BlessInstructionStep[] = [
  {
    title: "Check the parts",
    body: "Lay out one capsule, one USB board, one metal body, and six M2 screws.\nReturn any part with a scratch.",
    image: art("🧩", "e6e6e6"),
    alt: "The parts in a row on a mat",
  },
  {
    title: "Fit the capsule",
    body: "Push the capsule into the clip of the board until it clicks.",
    image: art("🎙️", "f3e1e7"),
    alt: "A capsule above a circuit board",
    caution: "Wear the anti-static strap. A charge can break the capsule.",
  },
  {
    title: "Close the body",
    body: "Slide the board into the body and fit the six screws, crosswise.",
    image: art("🔩", "dfe8f3"),
    alt: "Screws around a metal tube",
  },
  {
    title: "Test the sound",
    body: "Plug the mic into the test station and say the test line. The meter must show green.",
    image: art("✅", "e8f3df"),
    alt: "A green meter on a screen",
  },
];
const at = ref(0);
const done = ref(false);
</script>

<template>
  <p v-if="done">Job done. Scan the next unit.</p>
  <BlessWorkInstructions
    v-else
    v-model="at"
    job="Desk mic kit · WO-2026-0091"
    :steps
    @finish="done = true"
  />
</template>
