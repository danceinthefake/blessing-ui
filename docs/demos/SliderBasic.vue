<script setup lang="ts">
import { ref } from "vue";
import { BlessSlider } from "blessing-ui";
const vol = ref(35);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessSlider v-model="vol" label="Volume" show-value :format="(v) => `${v}%`" />
    </div>
    <div class="col">
      <BlessSlider :model-value="3" :min="1" :max="5" label="Rating" show-value />
    </div>
    <div class="col"><BlessSlider :model-value="60" disabled label="Disabled" /></div>
  </div>
</template>
