<script setup lang="ts">
import { ref } from "vue";
import { BlessCheckbox } from "blessing-ui";
const picks = ref<string[]>(["eriri"]);
</script>

<template>
  <div class="row">
    <BlessCheckbox v-for="h in ['megumi', 'eriri', 'utaha']" :key="h" v-model="picks" :value="h">{{
      h
    }}</BlessCheckbox>
    <small>picks: {{ picks }}</small>
  </div>
</template>
