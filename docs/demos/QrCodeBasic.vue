<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessInput, BlessQrCode } from "blessing-ui";
import { encode } from "uqr";
const text = ref("https://www.saenai.tv/");
const matrix = computed(() => encode(text.value, { ecc: "M" }).data);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessInput v-model="text" placeholder="text or URL" />
      <small>{{ matrix.length }}×{{ matrix.length }} modules, ECC M</small>
    </div>
    <BlessQrCode :matrix :value="text" />
    <BlessQrCode :matrix :value="text" :size="120" frame color="#ff0054" />
  </div>
</template>
