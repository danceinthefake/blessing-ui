<script setup lang="ts">
import { encode } from "uqr";
import { BlessTicket } from "blessing-ui";

// uqr makes the QR modules; install it yourself (see the QR code page)
const code = "HSL-0050-C5";
const qr = encode(code).data;
</script>

<template>
  <BlessTicket
    event="Home Studio Live"
    subtitle="Episode 50, recorded with an audience"
    date="Sat 28 Nov 2026"
    time="19:30"
    venue="Kineforum, Jakarta"
    seat="C5"
    holder="Rara Wijaya"
    :code
    :qr
  />
</template>
