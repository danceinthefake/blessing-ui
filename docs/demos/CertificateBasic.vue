<script setup lang="ts">
import { BlessButton, BlessCertificate } from "blessing-ui";

// print only the certificate: hide the rest of the page in your print styles
const print = () => window.print();
</script>

<template>
  <div style="display: grid; gap: 12px; justify-items: start">
    <BlessCertificate
      name="Ana Putri"
      course="Home recording from zero"
      date="17 November 2026"
      issuer="Bunyi Studio School"
      signer="Rina Hartono"
      signer-role="Course teacher"
      code="BSS-2026-0417"
      verify-url="example.com/verify"
      style="inline-size: 100%"
    />
    <BlessButton @click="print">Print</BlessButton>
  </div>
</template>
