<script setup lang="ts">
import { ref } from "vue";
import { BlessToggle, BlessToggleGroup } from "blessing-ui";
const align = ref<string | undefined>("left");
const fmt = ref<string[]>(["b", "i"]);
</script>

<template>
  <div class="row">
    <BlessToggleGroup v-model="align" label="Align">
      <BlessToggle value="left">L</BlessToggle>
      <BlessToggle value="center">C</BlessToggle>
      <BlessToggle value="right">R</BlessToggle>
    </BlessToggleGroup>
    <BlessToggleGroup v-model="fmt" type="multiple" label="Format">
      <BlessToggle value="b">B</BlessToggle>
      <BlessToggle value="i">I</BlessToggle>
      <BlessToggle value="u">U</BlessToggle>
    </BlessToggleGroup>
    <small>align: {{ align }} · fmt: {{ fmt }}</small>
  </div>
</template>
