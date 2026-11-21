<template>
  <div style="display: grid; gap: 12px; justify-items: start">
    <BlessFollowButton v-model="studio" name="Home Studio" :followers="12480" />
    <BlessFollowButton v-model="ana" name="Ana Putri" :followers="831" />
    <BlessFollowButton name="Radio Kita" :followers="2310000" locale="id-ID" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessFollowButton } from "blessing-ui";

const studio = ref(false);
const ana = ref(true);
</script>
