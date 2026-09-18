<script setup lang="ts">
defineOptions({ name: "BlessSkeleton" });

withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    /** render n text lines instead of one block */
    lines?: number;
    circle?: boolean;
  }>(),
  { width: "100%", height: "1em" },
);
</script>

<template>
  <div v-if="lines" class="bless-skeleton-lines" aria-hidden="true">
    <span
      v-for="i in lines"
      :key="i"
      class="bless-skeleton"
      :style="{ width: i === lines && lines > 1 ? '60%' : width, height }"
    />
  </div>
  <span
    v-else
    class="bless-skeleton"
    :class="{ 'bless-skeleton--circle': circle }"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style>
.bless-skeleton {
  display: block;
  background: var(--bless-color-surface);
  background-image: linear-gradient(
    100deg,
    transparent 30%,
    var(--bless-color-bg) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: bless-shimmer 1.4s var(--bless-ease-linear) infinite;
  transform: skewX(var(--bless-skew));
}
.bless-skeleton--circle {
  border-radius: 50%;
  transform: none;
}
.bless-skeleton-lines {
  display: grid;
  gap: var(--bless-space-2);
}
@keyframes bless-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-skeleton {
    animation: none;
  }
}
</style>
