<script setup lang="ts">
import { ref } from "vue";
import { BlessCarousel } from "blessing-ui";
const slide = ref(0);
</script>

<template>
  <div style="max-width: 480px">
    <BlessCarousel v-model="slide" :autoplay="3000" loop label="Key visuals">
      <div
        v-for="n in 5"
        :key="n"
        style="
          height: 200px;
          display: grid;
          place-items: center;
          font-size: 48px;
          color: var(--bless-color-on-accent);
          background: var(--bless-color-accent);
        "
      >
        {{ n }}
      </div>
    </BlessCarousel>
    <small>slide {{ slide + 1 }} · autoplay 3s, loops, pauses on hover</small>
  </div>
</template>
