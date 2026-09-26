<script setup lang="ts">
import { BlessText } from "blessing-ui";
</script>

<template>
  <div class="col" style="gap: 6px; max-width: none">
    <BlessText size="headline" weight="thin" leading="none">Thin 100</BlessText>
    <BlessText size="lg" weight="light">Light 300 — headings</BlessText>
    <BlessText size="lg" weight="normal">Normal 400 — body</BlessText>
    <BlessText size="lg" weight="bold">Bold 700 — labels</BlessText>
    <BlessText size="lg" weight="normal">日本語 — Noto Sans JP, or the system gothic</BlessText>
  </div>
</template>
