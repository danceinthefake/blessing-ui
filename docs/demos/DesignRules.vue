<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessInput, BlessProgress, BlessToggle, BlessToggleGroup } from "blessing-ui";
const view = ref<string | undefined>("week");
const note = ref("");
const done = ref(60);
</script>

<template>
  <div class="col">
    <div class="row">
      <BlessButton @click="done = 100">Finish</BlessButton>
      <BlessButton variant="outline" @click="done = 60">Reset</BlessButton>
      <BlessToggleGroup v-model="view" label="View">
        <BlessToggle value="day">Day</BlessToggle>
        <BlessToggle value="week">Week</BlessToggle>
        <BlessToggle value="month">Month</BlessToggle>
      </BlessToggleGroup>
    </div>
    <BlessInput v-model="note" placeholder="Write a line" aria-label="Note" />
    <BlessProgress :value="done" label="Chapter" show-value />
  </div>
</template>
