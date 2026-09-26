<script setup lang="ts">
defineOptions({ name: "BlessAspectRatio" });

withDefaults(
  defineProps<{
    /** `16 / 9` or `"16 / 9"` — anything `aspect-ratio` accepts */
    ratio?: number | string;
    /** how a bare img / video child fills the box (an iframe always fills it) */
    fit?: "cover" | "contain";
  }>(),
  { ratio: 16 / 9, fit: "cover" },
);
</script>

<template>
  <div class="bless-aspect" :class="`bless-aspect--${fit}`" :style="{ aspectRatio: String(ratio) }">
    <slot />
  </div>
</template>

<style>
.bless-aspect {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.bless-aspect > img,
.bless-aspect > video,
.bless-aspect > iframe {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 0;
}
.bless-aspect--contain > img,
.bless-aspect--contain > video {
  object-fit: contain;
}
</style>
