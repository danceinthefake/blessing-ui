<script setup lang="ts">
defineOptions({ name: "BlessSkeleton" });

withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    /** render n text lines instead of one block */
    lines?: number;
    /** an avatar placeholder: a petal, like BlessAvatar */
    avatar?: boolean;
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
    :class="{ 'bless-skeleton--avatar': avatar }"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style>
/* a flat plate that breathes — no shimmer sweep, nothing glossy */
.bless-skeleton {
  border-radius: var(--bless-radius-plate);
  display: block;
  background: var(--bless-color-surface);
  animation: bless-skeleton-pulse 1.6s var(--bless-ease-in-out) infinite;
  transform: skewX(var(--bless-skew));
}
.bless-skeleton--avatar {
  border-radius: var(--bless-radius-petal);
  transform: none;
}
.bless-skeleton-lines {
  display: grid;
  gap: var(--bless-space-2);
}
@keyframes bless-skeleton-pulse {
  50% {
    opacity: 0.55;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-skeleton {
    animation: none;
  }
}
</style>
