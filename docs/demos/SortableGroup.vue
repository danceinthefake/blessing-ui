<script setup lang="ts">
import { ref } from "vue";
import { BlessSortable } from "blessing-ui";
const todo = ref(["Write the intro", "Record the demo", "Proofread"]);
const done = ref(["Pick a title"]);
</script>

<template>
  <div class="row" style="align-items: stretch; max-width: 560px">
    <div style="flex: 1">
      <BlessSortable v-model="todo" group="chores" label="To do" :row-key="(t: string) => t" />
    </div>
    <div style="flex: 1">
      <BlessSortable v-model="done" group="chores" label="Done" :row-key="(t: string) => t" />
    </div>
  </div>
</template>
