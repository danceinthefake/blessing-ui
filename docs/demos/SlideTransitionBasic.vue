<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessSlideTransition, BlessText } from "blessing-ui";
const open = ref(true);
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessButton size="sm" variant="outline" @click="open = !open">{{
      open ? "Collapse" : "Expand"
    }}</BlessButton>
    <BlessSlideTransition>
      <div v-if="open" style="background: var(--bless-color-surface); padding: 12px">
        <BlessText as="p"
          >Height animates from 0 to auto and back — no fixed max-height hack.</BlessText
        >
      </div>
    </BlessSlideTransition>
  </div>
</template>
