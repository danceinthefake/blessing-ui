<template>
  <div style="max-width: 560px">
    <BlessPaywall
      :plans="[
        { id: 'month', name: 'Monthly', price: 'Rp 49.000 / month' },
        { id: 'year', name: 'Yearly', price: 'Rp 470.000 / year', note: 'Two months free' },
      ]"
      pick="year"
      sign-in-href="#sign-in"
      @subscribe="(id) => (picked = id)"
    >
      <p>
        Most home studios fail for one reason: the room. Before you spend on a new microphone,
        listen to how your voice comes back from the walls. Clap once and count the echo. Then try
        the same clap in front of an open wardrobe.
      </p>
    </BlessPaywall>
    <p v-if="picked" style="margin-top: 12px">Go to checkout for the {{ picked }} plan.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPaywall } from "blessing-ui";

const picked = ref("");
</script>
