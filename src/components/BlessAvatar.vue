<script setup lang="ts">
import { computed, ref, watch } from "vue";

defineOptions({ name: "BlessAvatar" });

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    /** used for initials fallback */
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** skewed square frame instead of circle */
    square?: boolean;
    color?: "surface" | "accent" | "text";
  }>(),
  { size: "md", color: "surface" },
);

const failed = ref(false);
watch(
  () => props.src,
  () => (failed.value = false),
);
const initials = computed(() =>
  (props.name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join(""),
);
const showImg = computed(() => !!props.src && !failed.value);
</script>

<template>
  <span
    class="bless-avatar"
    :class="[`bless-avatar--${size}`, `bless-avatar--${color}`, { 'bless-avatar--square': square }]"
    :role="showImg ? undefined : 'img'"
    :aria-label="showImg ? undefined : (alt ?? name)"
  >
    <img
      v-if="showImg"
      :src
      :alt="alt ?? name ?? ''"
      class="bless-avatar__img"
      @error="failed = true"
    />
    <span v-else class="bless-avatar__fallback" aria-hidden="true"
      ><slot>{{ initials }}</slot></span
    >
  </span>
</template>

<style>
.bless-avatar {
  --_s: 40px;
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--_s);
  height: var(--_s);
  overflow: hidden;
  border-radius: var(--bless-radius-petal);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: calc(var(--_s) * 0.4);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  vertical-align: middle;
}
.bless-avatar--xs {
  --_s: 24px;
}
.bless-avatar--sm {
  --_s: 32px;
}
.bless-avatar--lg {
  --_s: 56px;
}
.bless-avatar--xl {
  --_s: 80px;
}
.bless-avatar--accent {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-avatar--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.bless-avatar--square {
  border-radius: var(--bless-radius-petal);
  transform: skewX(var(--bless-skew));
}
.bless-avatar--square > * {
  transform: skewX(var(--bless-skew-counter));
}
.bless-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bless-avatar--square .bless-avatar__img {
  width: 120%;
  height: 100%;
}
.bless-avatar__fallback {
  line-height: 1;
}
</style>
