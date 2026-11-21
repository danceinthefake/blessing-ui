<template>
  <div style="max-width: 480px">
    <BlessAddressFields v-model="address" label="Shipping address" />
    <BlessText as="p" size="sm" style="margin-top: 12px">
      Change the country to see the fields move. {{ JSON.stringify(address) }}
    </BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessAddressFields, BlessText, type BlessAddress } from "blessing-ui";

const address = ref<BlessAddress>({
  country: "ID",
  line1: "Jl. Braga No. 41",
  city: "Bandung",
  region: "Jawa Barat",
});
</script>
