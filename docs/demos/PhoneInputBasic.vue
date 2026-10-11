<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessPhoneInput } from "blessing-ui";
const phone = ref("");
const country = ref<string>();
</script>

<template>
  <div class="col">
    <BlessLabel for="d-phone2">Phone</BlessLabel>
    <BlessPhoneInput id="d-phone2" v-model="phone" v-model:country="country" default-country="ID" />
    <small>value: {{ phone || "—" }} · country: {{ country ?? "—" }}</small>
  </div>
</template>
