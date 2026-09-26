<script setup lang="ts">
import { ref } from "vue";
import { BlessCascadeSelect, BlessLabel, type BlessCascadeOption } from "blessing-ui";
const options: BlessCascadeOption<string>[] = [
  {
    value: "jp",
    label: "Japan",
    children: [
      {
        value: "tokyo",
        label: "Tokyo",
        children: [
          { value: "shinjuku", label: "Shinjuku" },
          { value: "akiba", label: "Akihabara" },
          { value: "ikebukuro", label: "Ikebukuro" },
        ],
      },
      {
        value: "osaka",
        label: "Osaka",
        children: [
          { value: "namba", label: "Namba" },
          { value: "umeda", label: "Umeda" },
        ],
      },
      { value: "kyoto", label: "Kyoto" },
    ],
  },
  { value: "kr", label: "Korea", children: [{ value: "seoul", label: "Seoul" }] },
  { value: "cn", label: "China", disabled: true },
];
const place = ref<string>();
const area = ref<string>("akiba");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel>Where</BlessLabel>
      <BlessCascadeSelect v-model="place" :options placeholder="Country › City › Area" />
      <small>{{ place ?? "—" }} · ↑↓ move, → drill, ← back, Enter pick</small>
    </div>
    <div class="col">
      <BlessLabel>Leaf only</BlessLabel>
      <BlessCascadeSelect v-model="area" :options :show-path="false" size="sm" />
    </div>
  </div>
</template>
