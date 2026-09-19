<script setup lang="ts">
import { ref } from "vue";
import { BlessSwap } from "blessing-ui";
const on = ref(false);
</script>

<template>
  <div class="row" style="gap: 24px; font-size: 28px">
    <BlessSwap v-model="on" label="Play / pause">
      <template #on>❚❚</template>
      <template #off>▶</template>
    </BlessSwap>
    <BlessSwap label="Theme" effect="rotate">
      <template #on>☾</template>
      <template #off>☀</template>
    </BlessSwap>
    <BlessSwap label="Like" effect="flip">
      <template #on><span style="color: var(--bless-color-accent)">♥</span></template>
      <template #off>♡</template>
    </BlessSwap>
    <BlessSwap label="Disabled" disabled />
  </div>
</template>
