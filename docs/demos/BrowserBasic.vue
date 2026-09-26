<script setup lang="ts">
import { ref } from "vue";
import { useMedia, useResizeObserver, useScroll, useVisibility } from "blessing-ui";

const box = ref<HTMLElement>();
const { width, height } = useResizeObserver(box);
const { y, direction } = useScroll();
const { visible } = useVisibility();
const wide = useMedia("(min-width: 800px)");
// reducedMotion() reads once when called; for a live ref, the same query through useMedia
const reduce = useMedia("(prefers-reduced-motion: reduce)");
</script>

<template>
  <div class="browser">
    <div ref="box" class="browser__box">drag my corner</div>
    <dl class="browser__out">
      <dt>useResizeObserver</dt>
      <dd>{{ Math.round(width) }} × {{ Math.round(height) }}</dd>
      <dt>useScroll</dt>
      <dd>y {{ Math.round(y) }} · {{ direction ?? "—" }}</dd>
      <dt>useVisibility</dt>
      <dd>{{ visible ? "visible" : "hidden" }}</dd>
      <dt>useMedia (min-width: 800px)</dt>
      <dd>{{ wide }}</dd>
      <dt>reduced motion</dt>
      <dd>{{ reduce }}</dd>
    </dl>
  </div>
</template>

<style scoped>
.browser {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-6);
  align-items: flex-start;
}
.browser__box {
  display: grid;
  place-items: center;
  width: 200px;
  height: 100px;
  min-width: 120px;
  min-height: 60px;
  max-width: 100%;
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  resize: both;
  overflow: hidden;
}
.browser__out {
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--bless-space-1) var(--bless-space-4);
  margin: 0;
  font-size: var(--bless-text-sm);
}
.browser__out dt {
  font-family: var(--vp-font-family-mono, monospace);
  color: var(--bless-color-text-muted);
}
.browser__out dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
}
</style>
