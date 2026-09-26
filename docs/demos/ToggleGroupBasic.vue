<script setup lang="ts">
import { ref } from "vue";
import { BlessToggle, BlessToggleGroup } from "blessing-ui";
const align = ref<string | undefined>("left");
const fmt = ref<string[]>(["b", "i"]);
</script>

<template>
  <div class="row">
    <BlessToggleGroup v-model="align" label="Align">
      <BlessToggle value="left" label="Align left">L</BlessToggle>
      <BlessToggle value="center" label="Align centre">C</BlessToggle>
      <BlessToggle value="right" label="Align right">R</BlessToggle>
    </BlessToggleGroup>
    <BlessToggleGroup v-model="fmt" type="multiple" label="Format">
      <BlessToggle value="b" label="Bold">B</BlessToggle>
      <BlessToggle value="i" label="Italic">I</BlessToggle>
      <BlessToggle value="u" label="Underline">U</BlessToggle>
    </BlessToggleGroup>
    <small>align: {{ align }} · fmt: {{ fmt }}</small>
  </div>
</template>
