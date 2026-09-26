<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessSheet, BlessText } from "blessing-ui";
const open = ref(false);
const side = ref<"left" | "right" | "top" | "bottom">("right");
function show(s: typeof side.value) {
  side.value = s;
  open.value = true;
}
</script>

<template>
  <div class="row">
    <BlessButton
      v-for="s in ['right', 'left', 'top', 'bottom'] as const"
      :key="s"
      variant="outline"
      @click="show(s)"
      >{{ s }}</BlessButton
    >
  </div>
  <BlessSheet v-model="open" :side title="Filters">
    <BlessText as="p">Native &lt;dialog&gt; side panel. Esc / backdrop / × close it.</BlessText>
    <template #footer>
      <BlessButton variant="outline" @click="open = false">Cancel</BlessButton>
      <BlessButton @click="open = false">Apply</BlessButton>
    </template>
  </BlessSheet>
</template>
