<script setup lang="ts">
import { ref } from "vue";
import { BlessSwap } from "blessing-ui";
const on = ref(false);
</script>

<template>
  <div class="row" style="gap: 24px; font-size: 28px">
    <BlessSwap v-model="on" label="Playing">
      <template #on>❚❚</template>
      <template #off>▶</template>
    </BlessSwap>
    <BlessSwap label="Dark theme" effect="rotate">
      <template #on>☾</template>
      <template #off>☀</template>
    </BlessSwap>
    <BlessSwap label="Liked" effect="flip">
      <template #on><span style="color: var(--bless-color-accent)">♥</span></template>
      <template #off>♡</template>
    </BlessSwap>
    <BlessSwap label="Muted" disabled>
      <template #on>🔇</template>
      <template #off>🔈</template>
    </BlessSwap>
  </div>
</template>
