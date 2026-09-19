<script setup lang="ts">
import { ref } from "vue";
import { BlessInplace, BlessInput } from "blessing-ui";
const title = ref("第3話 フラグの立たない");
</script>

<template>
  <div class="col">
    <BlessInplace closable>
      <template #display>{{ title || "Click to edit" }}</template>
      <template #content="{ close }"
        ><BlessInput v-model="title" size="sm" autofocus @keydown.enter="close"
      /></template>
    </BlessInplace>
    <small>click the title · Enter or × to finish</small>
  </div>
</template>
