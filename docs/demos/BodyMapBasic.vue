<template>
  <BlessBodyMap v-model="pain" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessBodyMap, type BlessBodyPart } from "blessing-ui";

const pain = ref<BlessBodyPart[]>(["neck", "rightArm"]);
</script>
