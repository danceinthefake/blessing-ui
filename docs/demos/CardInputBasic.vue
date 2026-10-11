<script setup lang="ts">
import { ref } from "vue";
import { BlessCardInput, BlessLabel } from "blessing-ui";
const card = ref("");
</script>

<template>
  <div class="col">
    <BlessLabel for="d-cc">Card number</BlessLabel>
    <BlessCardInput id="d-cc" v-model="card" />
    <small>digits: {{ card || "—" }} · try 4242 4242 4242 4242 or 3782 822463 10005</small>
  </div>
</template>
