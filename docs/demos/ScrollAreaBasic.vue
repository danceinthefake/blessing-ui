<script setup lang="ts">
import { BlessScrollArea } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessScrollArea
      height="140px"
      width="320px"
      style="background: var(--bless-color-surface); padding: 12px"
    >
      <p v-for="n in 12" :key="n" style="margin: 0 0 8px">
        第{{ n }}話 — vertical, thin scrollbar, faded edges
      </p>
    </BlessScrollArea>
    <BlessScrollArea
      axis="x"
      width="320px"
      style="background: var(--bless-color-surface); padding: 12px"
    >
      <div style="display: flex; gap: 8px; width: max-content">
        <span v-for="n in 12" :key="n" style="padding: 8px 16px; background: var(--bless-color-bg)"
          >chip {{ n }}</span
        >
      </div>
    </BlessScrollArea>
  </div>
</template>
