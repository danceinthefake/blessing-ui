<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessConfetti } from "blessing-ui";

const confetti = ref<InstanceType<typeof BlessConfetti>>();
const done = ref(false);
function celebrate(e: MouseEvent) {
  done.value = false;
  confetti.value?.fire(e.currentTarget as HTMLElement);
}
</script>

<template>
  <div class="row">
    <BlessButton @click="celebrate">Mark as done</BlessButton>
    <BlessButton variant="outline" @click="confetti?.fire(undefined, 270)"
      >From the middle</BlessButton
    >
    <span aria-live="polite">{{ done ? "Finished." : "" }}</span>
    <BlessConfetti ref="confetti" @done="done = true" />
  </div>
</template>
