<script setup lang="ts">
import { ref } from "vue";
import { BlessRange } from "blessing-ui";
const price = ref<[number, number]>([1980, 6800]);
const hours = ref<[number, number]>([9, 17]);
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessRange
      v-model="price"
      :min="0"
      :max="10000"
      :step="100"
      :gap="500"
      label="Price"
      show-value
      :format="(v) => `¥${v.toLocaleString()}`"
    />
    <BlessRange
      v-model="hours"
      :min="0"
      :max="24"
      label="Hours"
      show-value
      :format="(v) => `${v}:00`"
    />
    <BlessRange :model-value="[30, 70]" disabled />
  </div>
</template>
