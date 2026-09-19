<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCommand, BlessKbd, useToast } from "blessing-ui";
import { commands } from "./_commands";
const open = ref(false);
const { toast } = useToast();
</script>

<template>
  <div class="row">
    <BlessButton color="accent" @click="open = true">Command palette</BlessButton>
    <span>or press <BlessKbd :keys="['⌘', 'K']" /></span>
  </div>
  <BlessCommand
    v-model:open="open"
    :items="commands"
    @select="toast({ title: $event.label, color: 'accent' })"
  >
    <template #footer>
      <span><BlessKbd>↑↓</BlessKbd> navigate</span>
      <span><BlessKbd>↵</BlessKbd> select</span>
      <span><BlessKbd>esc</BlessKbd> close</span>
    </template>
  </BlessCommand>
</template>
