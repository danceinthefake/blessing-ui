<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessSelect } from "blessing-ui";
const season = ref<string>();
const small = ref("s1");
const large = ref<string>();
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
        description="The two TV seasons and the film"
      />
    </div>
    <div class="col">
      <BlessLabel for="d-sm">Season (small)</BlessLabel>
      <BlessSelect id="d-sm" v-model="small" size="sm" :options />
    </div>
    <div class="col">
      <BlessLabel for="d-lg">Season (large)</BlessLabel>
      <BlessSelect
        id="d-lg"
        v-model="large"
        size="lg"
        placeholder="Choose…"
        :options
        :error="large ? '' : 'Pick one'"
      />
    </div>
  </div>
</template>
