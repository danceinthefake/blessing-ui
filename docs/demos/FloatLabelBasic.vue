<script setup lang="ts">
import { ref } from "vue";
import { BlessFloatLabel, BlessInput, BlessTextarea } from "blessing-ui";
const name = ref("");
const mail = ref("megumi@example.com");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessFloatLabel label="Name"><BlessInput v-model="name" placeholder=" " /></BlessFloatLabel>
    </div>
    <div class="col">
      <BlessFloatLabel label="Email"
        ><BlessInput v-model="mail" placeholder=" " type="email"
      /></BlessFloatLabel>
    </div>
    <div class="col">
      <BlessFloatLabel label="In-field (IFTA)" variant="in"><BlessInput /></BlessFloatLabel>
    </div>
    <div class="col">
      <BlessFloatLabel label="Notes"><BlessTextarea placeholder=" " :rows="2" /></BlessFloatLabel>
    </div>
  </div>
</template>
