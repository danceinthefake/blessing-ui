<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCountUp } from "blessing-ui";

const n = ref(12840);
const bump = () => (n.value += Math.round(Math.random() * 5000));
</script>

<template>
  <div class="col">
    <p style="font-size: 2rem; margin: 0">
      <BlessCountUp :value="n" locale="en" />
    </p>
    <p style="font-size: 2rem; margin: 0">
      <BlessCountUp
        :value="n / 100"
        locale="en"
        odometer
        :options="{ style: 'currency', currency: 'USD' }"
      />
    </p>
    <BlessButton @click="bump">Add sales</BlessButton>
  </div>
</template>
