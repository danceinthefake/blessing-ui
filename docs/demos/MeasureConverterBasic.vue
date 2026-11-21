<template>
  <BlessMeasureConverter
    v-model:kind="kind"
    v-model:amount="amount"
    v-model:from="from"
    v-model:to="to"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessMeasureConverter, type BlessMeasureKind } from "blessing-ui";

const kind = ref<BlessMeasureKind>("length");
const amount = ref(5);
const from = ref("kilometer");
const to = ref("mile");
</script>
