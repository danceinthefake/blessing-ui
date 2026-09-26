<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessSplash, BlessText } from "blessing-ui";
const key = ref(0);
function replay() {
  localStorage.removeItem("bless-docs-splash");
  key.value++;
}
</script>

<template>
  <BlessSplash :key once="bless-docs-splash" :duration="1500">
    <BlessText
      as="p"
      size="display"
      weight="thin"
      leading="none"
      style="transform: skewX(var(--bless-lean))"
    >
      Blessing
    </BlessText>
  </BlessSplash>
  <div class="row">
    <BlessText as="p" size="sm" muted>Shown once per visitor (localStorage key).</BlessText>
    <BlessButton size="sm" variant="outline" @click="replay">Replay</BlessButton>
  </div>
</template>
