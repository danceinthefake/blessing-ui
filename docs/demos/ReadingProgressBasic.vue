<script setup lang="ts">
import { ref } from "vue";
import { BlessReadingProgress } from "blessing-ui";

// on a real page, leave out `target` and `position`: the bar follows the page at the top of the window
const article = ref<HTMLElement>();
const paragraph =
  "A quiet room matters more than an expensive microphone. Hard walls send the voice back, and the microphone hears the echo a moment later. Soft things break up that echo: curtains, a sofa, a full bookshelf, or a wardrobe of clothes. Before you buy anything, record one minute in each room of your home and listen with headphones. Pick the room with the least echo, and put the microphone close to your mouth, about one hand away. ";
</script>

<template>
  <div
    ref="article"
    tabindex="0"
    role="region"
    aria-label="Article"
    style="
      max-width: 560px;
      height: 260px;
      overflow-y: auto;
      border: 1px solid var(--bless-color-border);
    "
  >
    <BlessReadingProgress v-if="article" :target="article" position="sticky" minutes :wpm="120" />
    <article style="padding: 16px">
      <h3 style="margin: 0 0 12px">Sound on a small budget</h3>
      <p v-for="n in 8" :key="n" style="margin: 0 0 12px">{{ paragraph }}</p>
    </article>
  </div>
</template>
