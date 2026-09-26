<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessSlideTransition, BlessText } from "blessing-ui";
const open = ref(true);
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessButton size="sm" variant="outline" @click="open = !open">{{
      open ? "Hide details" : "Show details"
    }}</BlessButton>
    <BlessSlideTransition>
      <div v-if="open" style="background: var(--bless-color-surface); padding: 12px">
        <BlessText as="p">第1話「冴えない竹馬の友の口説きかた」— 2019.04.04 · 24:00</BlessText>
      </div>
    </BlessSlideTransition>
  </div>
</template>
