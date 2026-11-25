<template>
  <div class="col" style="gap: 10px; max-width: none">
    <p style="margin: 0; font-family: var(--bless-font-serif); font-size: 36px; line-height: 1.12">
      Newsreader — editorial serif display &amp; dialogue
    </p>
    <BlessText size="lg" weight="normal">Plus Jakarta Sans 400 — calm UI body</BlessText>
    <BlessText size="lg" weight="bold">Plus Jakarta Sans 700 — labels &amp; controls</BlessText>
    <p
      style="
        margin: 0;
        font-family: var(--bless-font-mono);
        font-size: 13px;
        color: var(--bless-color-text-muted);
      "
    >
      04:12 · VOL 04 · 442 components (tabular monospace)
    </p>
    <BlessText size="md" weight="normal">日本語 — Noto Sans JP, or the system gothic</BlessText>
  </div>
</template>

<script setup lang="ts">
import { BlessText } from "blessing-ui";
</script>
