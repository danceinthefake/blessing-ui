<script setup lang="ts">
import { ref } from "vue";
import { BlessInputNumber, BlessLabel } from "blessing-ui";
const qty = ref(2);
const price = ref(1980);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col" style="max-width: 200px">
      <BlessLabel for="d-qty">Quantity</BlessLabel>
      <BlessInputNumber id="d-qty" v-model="qty" :min="1" :max="9" />
    </div>
    <div class="col" style="max-width: 240px">
      <BlessLabel for="d-price">Price</BlessLabel>
      <BlessInputNumber
        id="d-price"
        v-model="price"
        :step="100"
        :format="{ style: 'currency', currency: 'JPY' }"
        locale="ja-JP"
        :buttons="false"
        suffix="税込"
      />
    </div>
    <div class="col" style="max-width: 200px">
      <BlessLabel>Disabled</BlessLabel>
      <BlessInputNumber :model-value="5" disabled size="sm" label="Disabled quantity" />
    </div>
  </div>
</template>
