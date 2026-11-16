<script setup lang="ts">
import { ref } from "vue";
import { BlessUnitConverter, type BlessUnit } from "blessing-ui";

// the packs of one product: XLR cables come 10 to a box and 12 boxes to a carton
const units: BlessUnit[] = [
  { id: "pcs", name: "pcs", perBase: 1 },
  { id: "box", name: "boxes", perBase: 10 },
  { id: "carton", name: "cartons", perBase: 120 },
];
const amount = ref(275);
const from = ref("pcs");
const to = ref("box");
</script>

<template>
  <BlessUnitConverter v-model:amount="amount" v-model:from="from" v-model:to="to" :units />
</template>
