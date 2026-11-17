<script setup lang="ts">
import { BlessSearchResult } from "blessing-ui";
</script>

<template>
  <div style="display: grid; gap: 20px">
    <BlessSearchResult
      title="Renew your passport online"
      href="https://www.example.go.id/services/passport/renew"
      snippet="Renew an adult passport that ends within the next 9 months. You need your old passport, a photo, and a payment card."
      query="renew passport"
      kind="Service"
    />
    <BlessSearchResult
      title="Passport fees for 2026"
      href="https://www.example.go.id/guides/passport-fees"
      snippet="The fee for a 48-page passport is Rp 350,000. Electronic passports cost Rp 650,000."
      query="renew passport"
      kind="Guide"
      date="3 Nov 2026"
    />
  </div>
</template>
