<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessDrawer, BlessText } from "blessing-ui";
const open = ref(false);
</script>

<template>
  <BlessButton color="accent" @click="open = true">Open drawer</BlessButton>
  <BlessDrawer v-model="open" title="Share">
    <BlessText as="p">Drag the handle down 80px to close.</BlessText>
    <div class="row" style="margin-top: 12px">
      <BlessButton size="sm">Twitter</BlessButton>
      <BlessButton size="sm" variant="outline">Copy link</BlessButton>
    </div>
  </BlessDrawer>
</template>
