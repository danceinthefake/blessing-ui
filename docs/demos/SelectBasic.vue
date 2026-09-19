<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessSelect } from "blessing-ui";
const season = ref<string>();
const options = [
  { value: "s1", label: "第一期 (2015)" },
  { value: "s2", label: "第二期 ♭ (2017)" },
  { label: "Film", options: [{ value: "fine", label: "Fine (2019)" }] },
  { value: "s3", label: "第三期", disabled: true },
];
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-season">Season</BlessLabel>
      <BlessSelect
        id="d-season"
        v-model="season"
        placeholder="Choose…"
        :options
        description="native select, styled"
      />
    </div>
    <div class="col">
      <BlessLabel for="d-sm">Small</BlessLabel>
      <BlessSelect id="d-sm" size="sm" :options="[{ value: 1, label: 'sm' }]" :model-value="1" />
    </div>
    <div class="col">
      <BlessLabel for="d-lg">Large</BlessLabel>
      <BlessSelect
        id="d-lg"
        size="lg"
        :options="[{ value: 1, label: 'lg' }]"
        :model-value="1"
        error="Pick one"
      />
    </div>
  </div>
</template>
