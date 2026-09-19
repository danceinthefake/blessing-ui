<script setup lang="ts">
import { ref } from "vue";
import { BlessPickList } from "blessing-ui";
const source = ref([
  { value: "megumi", label: "加藤恵" },
  { value: "eriri", label: "英梨々" },
  { value: "utaha", label: "詩羽" },
  { value: "michiru", label: "美智留" },
  { value: "izumi", label: "出海" },
]);
const target = ref([{ value: "tomoya", label: "倫也" }]);
</script>

<template>
  <div style="max-width: 560px">
    <BlessPickList
      v-model:source="source"
      v-model:target="target"
      source-label="Cast"
      target-label="Main"
      :rows="4"
    />
  </div>
</template>
