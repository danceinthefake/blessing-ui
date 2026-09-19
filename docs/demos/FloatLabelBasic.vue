<script setup lang="ts">
import { ref } from "vue";
import { BlessFloatLabel, BlessInput, BlessTextarea } from "blessing-ui";
const name = ref("");
const mail = ref("megumi@example.com");
</script>

<template>
  <div class="row" style="align-items: flex-start; padding-top: 12px">
    <div class="col">
      <BlessFloatLabel label="Name" for="d-fl1"
        ><BlessInput id="d-fl1" v-model="name" placeholder=" "
      /></BlessFloatLabel>
    </div>
    <div class="col">
      <BlessFloatLabel label="Email" for="d-fl2"
        ><BlessInput id="d-fl2" v-model="mail" placeholder=" " type="email"
      /></BlessFloatLabel>
    </div>
    <div class="col">
      <BlessFloatLabel label="In-field (IFTA)" for="d-fl3" variant="in"
        ><BlessInput id="d-fl3" placeholder=" "
      /></BlessFloatLabel>
    </div>
    <div class="col">
      <BlessFloatLabel label="Notes" for="d-fl4"
        ><BlessTextarea id="d-fl4" placeholder=" " :rows="2"
      /></BlessFloatLabel>
    </div>
  </div>
</template>
