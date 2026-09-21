<script setup lang="ts">
import { ref } from "vue";
import { BlessCard, BlessText, useAnimateOnScroll } from "blessing-ui";
const el = ref<HTMLElement>();
const { visible } = useAnimateOnScroll(el, { threshold: 0.4 });
</script>

<template>
  <div ref="el" class="aos" :data-visible="visible">
    <BlessCard label="Reveal"
      ><BlessText as="p">Fades in once when 40% of it is in view.</BlessText></BlessCard
    >
  </div>
</template>

<style scoped>
/* an appearance fades; a 4px rise only says which way it came from */
.aos {
  opacity: 0;
  translate: 0 4px;
  transition:
    opacity var(--bless-duration-slower) var(--bless-ease-out),
    translate var(--bless-duration-slower) var(--bless-ease-out);
}
.aos[data-visible="true"] {
  opacity: 1;
  translate: 0 0;
}
</style>
