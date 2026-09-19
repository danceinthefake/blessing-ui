<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessModal, BlessText } from "blessing-ui";
const open = ref(false);
</script>

<template>
  <BlessButton color="accent" @click="open = true">Open modal</BlessButton>
  <BlessModal v-model="open" title="Blu-ray Disc BOX">
    <BlessText as="p">native &lt;dialog&gt;: focus trap, Esc, backdrop click, top layer.</BlessText>
    <template #footer>
      <BlessButton variant="outline" @click="open = false">閉じる</BlessButton>
      <BlessButton color="accent" @click="open = false">購入</BlessButton>
    </template>
  </BlessModal>
</template>
