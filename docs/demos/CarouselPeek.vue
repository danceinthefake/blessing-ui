<script setup lang="ts">
import { BlessCarousel } from "blessing-ui";
</script>

<template>
  <div style="max-width: 480px">
    <BlessCarousel :per-view="2.5" gap="8px" :dots="false">
      <div
        v-for="n in 7"
        :key="n"
        style="
          height: 160px;
          display: grid;
          place-items: center;
          font-size: 32px;
          background: var(--bless-color-surface);
        "
      >
        {{ n }}
      </div>
    </BlessCarousel>
    <small>perView 2.5 (peek), swipe / scroll-snap, ← →</small>
  </div>
</template>
