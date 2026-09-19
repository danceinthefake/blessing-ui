<script setup lang="ts">
import { ref } from "vue";
import { BlessColorPicker } from "blessing-ui";
const color = ref("#ff0054");
</script>

<template>
  <div class="col">
    <BlessColorPicker
      v-model="color"
      :swatches="['#ff0054', '#a759ff', '#ffa800', '#c0e722', '#3d3e3f']"
    />
    <BlessColorPicker model-value="#82909a" :show-value="false" disabled />
  </div>
</template>
