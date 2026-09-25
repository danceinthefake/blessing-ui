<script setup lang="ts">
import { ref } from "vue";
import { BlessInputMask, BlessLabel } from "blessing-ui";
const phone = ref("");
const raw = ref("");
const card = ref("");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-phone">Phone</BlessLabel>
      <BlessInputMask
        id="d-phone"
        v-model="phone"
        mask="###-####-####"
        @update:raw="raw = $event"
      />
      <small>masked: {{ phone || "—" }} · raw: {{ raw || "—" }}</small>
    </div>
    <div class="col">
      <BlessLabel for="d-card">Card</BlessLabel>
      <BlessInputMask id="d-card" v-model="card" mask="#### #### #### ####" />
    </div>
    <div class="col">
      <BlessLabel for="d-plate">Plate</BlessLabel>
      <BlessInputMask id="d-plate" mask="AA-## **" placeholder="AB-12 C3" />
    </div>
  </div>
</template>
