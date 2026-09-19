<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessModal, BlessText } from "blessing-ui";
const open = ref(false);
</script>

<template>
  <BlessButton href="#chara-megumi">Open via #chara-megumi</BlessButton>
  <BlessModal v-model="open" hash="chara-megumi" size="lg" title="加藤恵">
    <BlessText as="p"
      >opened from the URL hash — reload keeps it open, closing clears the hash.</BlessText
    >
  </BlessModal>
</template>
