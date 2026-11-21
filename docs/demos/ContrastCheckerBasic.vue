<template>
  <BlessContrastChecker v-model:text="text" v-model:background="background" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessContrastChecker } from "blessing-ui";

const text = ref("#c13b62");
const background = ref("#ffffff");
</script>
