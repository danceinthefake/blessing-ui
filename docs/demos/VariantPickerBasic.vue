<script setup lang="ts">
import { ref } from "vue";
import { BlessText, BlessVariantPicker } from "blessing-ui";

const options = [
  {
    key: "color",
    name: "Color",
    values: [
      { value: "black", label: "Black", color: "#1b1b1f" },
      { value: "heather", label: "Heather gray", color: "#9a9ca3" },
      { value: "sand", label: "Sand", color: "#d9c9a6", soldOut: true },
      { value: "rose", label: "Rose", color: "#d4677f" },
    ],
  },
  {
    key: "size",
    name: "Size",
    values: [
      { value: "xs", label: "XS", soldOut: true },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL", soldOut: true },
    ],
  },
];
const choice = ref<Record<string, string>>({ color: "black", size: "m" });
</script>

<template>
  <div>
    <BlessVariantPicker v-model="choice" :options />
    <BlessText as="p" size="sm" style="margin-top: 16px">
      Chosen: {{ JSON.stringify(choice) }}
    </BlessText>
  </div>
</template>
