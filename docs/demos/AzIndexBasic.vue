<template>
  <!-- the docs have a fixed header of 64 px -->
  <BlessAzIndex :items="services" style="--bless-az-top: 64px" />
</template>

<script setup lang="ts">
import { BlessAzIndex } from "blessing-ui";

const services = [
  "Birth certificate",
  "Building permit",
  "Business licence",
  "Car tax",
  "Child benefit",
  "Driving licence",
  "Death certificate",
  "Electricity connection",
  "Family card",
  "Fishing licence",
  "Health insurance (BPJS)",
  "Identity card (KTP)",
  "Import permit",
  "Land title",
  "Marriage certificate",
  "Passport",
  "Pension",
  "Police certificate",
  "School places",
  "Student loan",
  "Tax number (NPWP)",
  "Tax return",
  "Visa on arrival",
  "Vehicle registration",
  "Water connection",
  "112 emergency line",
].map((label) => ({ label, href: `#${label.toLowerCase().replace(/\W+/g, "-")}` }));
</script>
