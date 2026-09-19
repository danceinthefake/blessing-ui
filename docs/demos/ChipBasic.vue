<script setup lang="ts">
import { ref } from "vue";
import { BlessChip } from "blessing-ui";
import { shots } from "./_data";
const tags = ref(["megumi", "eriri", "utaha"]);
</script>

<template>
  <div class="row">
    <BlessChip
      v-for="t in tags"
      :key="t"
      :label="t"
      removable
      @remove="tags = tags.filter((x) => x !== t)"
    />
    <BlessChip label="accent" color="accent" icon="★" />
    <BlessChip label="text" color="text" size="sm" />
    <BlessChip label="with image" :image="shots[0].src" />
  </div>
</template>
