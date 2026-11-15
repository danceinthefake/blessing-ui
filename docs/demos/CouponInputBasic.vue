<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessCouponInput, BlessOrderSummary, type BlessCoupon } from "blessing-ui";

const lines = [
  { id: 1, name: "Home Studio hoodie", note: "Size M · Black", price: 48, quantity: 1 },
  { id: 2, name: "Pop filter", price: 12, quantity: 2 },
];
const applied = ref<BlessCoupon>();
const error = ref<string>();
const loading = ref(false);
const discount = computed(() => (applied.value ? 7.2 : 0));

// a stand-in for your server: LISTENER10 takes 10% off, every other code fails
function apply(code: string) {
  loading.value = true;
  error.value = undefined;
  setTimeout(() => {
    loading.value = false;
    if (code === "LISTENER10") applied.value = { code, saving: "10% off" };
    else error.value = `The code ${code} is not valid. Try LISTENER10.`;
  }, 600);
}
</script>

<template>
  <div style="max-width: 380px; display: flex; flex-direction: column; gap: 12px">
    <BlessCouponInput :applied :error :loading @apply="apply" @remove="applied = undefined" />
    <BlessOrderSummary :lines :discount :discount-label="applied?.code" :shipping="0" />
  </div>
</template>
