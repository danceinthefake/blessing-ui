<script setup lang="ts">
import { ref } from "vue";
import { BlessRsvp, type BlessRsvpAnswer } from "blessing-ui";

const answer = ref<BlessRsvpAnswer>();
const going = [
  { name: "Ana Putri" },
  { name: "Budi Santoso" },
  { name: "Citra Dewi" },
  { name: "Dimas" },
  { name: "Eka Pratama" },
  { name: "Fajar" },
];
</script>

<template>
  <BlessRsvp
    v-model="answer"
    :counts="{ yes: 41, maybe: 9, no: 4 }"
    :going
    label="Live recording of episode 50, Sat 28 Nov"
  />
</template>
