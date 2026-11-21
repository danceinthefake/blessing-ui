<template>
  <BlessApplicationStatus
    title="Business permit for a recording studio"
    reference="BP-2026-0417"
    :steps
    :current="1"
    state="action"
    action="Send page 2 of your lease by 20 November 2026. We cannot go on without it."
    action-href="#upload"
    action-label="Upload page 2 of the lease"
    next="When we have the page, an officer calls you to agree a date for the visit. Most visits happen within 5 working days."
  />
</template>

<script setup lang="ts">
import { BlessApplicationStatus, type BlessApplicationStep } from "blessing-ui";

const steps: BlessApplicationStep[] = [
  { label: "We got your request", date: "3 November 2026" },
  {
    label: "We checked your documents",
    date: "6 November 2026",
    note: "The lease is missing a page.",
  },
  { label: "An officer visits the place" },
  { label: "We make a decision" },
];
</script>
