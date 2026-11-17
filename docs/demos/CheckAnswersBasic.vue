<script setup lang="ts">
import { ref } from "vue";
import { BlessCheckAnswers, type BlessAnswerGroup } from "blessing-ui";

const groups: BlessAnswerGroup[] = [
  {
    title: "About the business",
    rows: [
      { key: "name", label: "Name of the business", value: "Bunyi Studio" },
      { key: "kind", label: "Kind of business", value: "Recording studio" },
      { key: "address", label: "Address", value: ["Jl. Kemang Raya 12", "Jakarta Selatan 12730"] },
    ],
  },
  {
    title: "About you",
    rows: [
      { key: "owner", label: "Full name", value: "Ana Putri" },
      { key: "phone", label: "Phone", value: "+62 812 3456 7890" },
      { key: "email", label: "Email", value: "" },
    ],
  },
];
const changing = ref("");
const sent = ref(false);
</script>

<template>
  <BlessCheckAnswers
    :groups
    declaration="I confirm that the answers are true. A false answer can end the permit."
    @change="changing = $event"
    @submit="sent = true"
  />
  <div v-if="changing" style="margin-top: 12px">Back to the question: {{ changing }}</div>
  <div v-if="sent" style="margin-top: 12px">Sent.</div>
</template>
