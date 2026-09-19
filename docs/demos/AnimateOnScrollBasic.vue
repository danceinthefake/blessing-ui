<script setup lang="ts">
import { ref } from "vue";
import { BlessCard, BlessText, useAnimateOnScroll } from "blessing-ui";
const el = ref<HTMLElement>();
const { visible } = useAnimateOnScroll(el, { threshold: 0.4 });
</script>

<template>
  <div ref="el" class="aos" :data-visible="visible">
    <BlessCard label="Reveal"
      ><BlessText as="p">Slides up once when 40% of it is in view.</BlessText></BlessCard
    >
  </div>
</template>

<style scoped>
.aos {
  opacity: 0;
  translate: 0 24px;
  transition:
    opacity 0.6s var(--bless-ease-out),
    translate 0.6s var(--bless-ease-out);
}
.aos[data-visible="true"] {
  opacity: 1;
  translate: 0 0;
}
</style>
