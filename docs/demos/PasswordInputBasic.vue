<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessPasswordInput } from "blessing-ui";
const pw = ref("Megumi1");
</script>

<template>
  <div class="col">
    <BlessLabel for="d-pw">Password</BlessLabel>
    <BlessPasswordInput id="d-pw" v-model="pw" meter placeholder="at least 8 characters" />
  </div>
</template>
