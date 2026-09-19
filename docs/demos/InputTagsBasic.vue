<script setup lang="ts">
import { ref } from "vue";
import { BlessInputTags, BlessLabel } from "blessing-ui";
const tags = ref(["anime", "2015"]);
</script>

<template>
  <div class="col">
    <BlessLabel for="d-tags">Tags</BlessLabel>
    <BlessInputTags id="d-tags" v-model="tags" placeholder="type, Enter or comma" :max="6" />
    <small>{{ tags }}</small>
  </div>
</template>
