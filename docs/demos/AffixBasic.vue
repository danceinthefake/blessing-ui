<script setup lang="ts">
import { BlessAffix } from "blessing-ui";
</script>

<template>
  <div style="height: 14rem; overflow: auto; border: 1px solid var(--bless-color-border)">
    <BlessAffix v-slot="{ stuck }">
      <div
        style="padding: 0.5rem 1rem; background: var(--bless-color-bg)"
        :style="stuck ? { boxShadow: 'var(--bless-shadow-plate)' } : {}"
      >
        {{ stuck ? "Stuck to the top" : "Scroll down" }}
      </div>
    </BlessAffix>
    <p v-for="n in 14" :key="n" style="margin: 1rem">Line {{ n }} of the scrolling area.</p>
  </div>
</template>
