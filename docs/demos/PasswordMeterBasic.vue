<script setup lang="ts">
import { ref } from "vue";
import { BlessInput, BlessPasswordMeter } from "blessing-ui";
const pw = ref("Megumi1");
</script>

<template>
  <div class="col">
    <BlessInput
      v-model="pw"
      type="password"
      placeholder="password"
      aria-label="Password"
      autocomplete="new-password"
    />
    <BlessPasswordMeter :value="pw" show-rules />
  </div>
</template>
