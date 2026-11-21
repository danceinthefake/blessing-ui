<template>
  <BlessStack direction="row" :gap="2" wrap>
    <BlessButton
      v-for="(s, i) in shots.slice(0, 4)"
      :key="s.src"
      size="sm"
      variant="outline"
      @click="index = i"
    >
      Open shot {{ i + 1 }}
    </BlessButton>
    <BlessLightbox v-model="index" :items="shots" />
  </BlessStack>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessLightbox, BlessStack } from "blessing-ui";
import { shots } from "./_data";

// any list of images, opened from any control: here a row of buttons
const index = ref(-1);
</script>
