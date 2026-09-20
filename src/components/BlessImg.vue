<script setup lang="ts">
import { ref } from "vue";
import BlessSkeleton from "./BlessSkeleton.vue";

defineOptions({ name: "BlessImg" });

withDefaults(
  defineProps<{
    src: string;
    alt: string;
    /** e.g. 16 / 9 or "4 / 5"; omit to use the image's own */
    ratio?: number | string;
    fit?: "cover" | "contain" | "fill" | "none";
    /** eager for above-the-fold images */
    loading?: "lazy" | "eager";
    /** tiny blurred placeholder (data URL / LQIP) */
    placeholder?: string;
    srcset?: string;
    sizes?: string;
  }>(),
  { fit: "cover", loading: "lazy" },
);
const loaded = ref(false);
const failed = ref(false);
</script>

<template>
  <span
    class="bless-img"
    :class="{ 'bless-img--loaded': loaded, 'bless-img--failed': failed }"
    :style="{ aspectRatio: ratio ?? undefined, '--_fit': fit }"
  >
    <img
      v-if="placeholder && !loaded"
      :src="placeholder"
      alt=""
      class="bless-img__placeholder"
      aria-hidden="true"
    />
    <BlessSkeleton
      v-else-if="!loaded && !failed"
      class="bless-img__skeleton"
      width="100%"
      height="100%"
    />
    <img
      :src
      :srcset
      :sizes
      :alt
      :loading
      decoding="async"
      class="bless-img__img"
      @load="loaded = true"
      @error="failed = true"
    />
    <span v-if="failed" class="bless-img__error" role="img" :aria-label="alt"
      ><slot name="error">⚠</slot></span
    >
    <span v-if="$slots.default" class="bless-img__overlay"><slot /></span>
  </span>
</template>

<style>
.bless-img {
  border-radius: var(--bless-radius);
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
}
.bless-img__img,
.bless-img__placeholder,
.bless-img__skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.bless-img__img {
  object-fit: var(--_fit);
  opacity: 0;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-img--loaded .bless-img__img {
  opacity: 1;
}
.bless-img__placeholder {
  object-fit: cover;
  filter: blur(12px);
  transform: scale(1.05);
}
.bless-img:not([style*="aspect-ratio"]) {
  aspect-ratio: 16 / 9;
}
.bless-img__error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-lg);
}
.bless-img__overlay {
  position: absolute;
  inset: auto 0 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: linear-gradient(transparent, rgb(0 0 0 / 0.6));
  color: #fff;
  font-size: var(--bless-text-xs);
}
</style>
