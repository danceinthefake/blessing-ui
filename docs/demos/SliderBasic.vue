<script setup lang="ts">
import { ref } from "vue";
import { BlessSlider } from "blessing-ui";
const vol = ref(35);
const zoom = ref(3);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessSlider v-model="vol" label="Volume" show-value :format="(v) => `${v}%`" />
    </div>
    <div class="col">
      <BlessSlider
        v-model="zoom"
        :min="1"
        :max="5"
        label="Zoom"
        show-value
        :format="(v) => `${v}×`"
      />
    </div>
    <div class="col"><BlessSlider :model-value="60" disabled label="Brightness (locked)" /></div>
  </div>
</template>
