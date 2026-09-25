<script setup lang="ts">
defineOptions({ name: "BlessVideo", inheritAttrs: false });
withDefaults(
  defineProps<{
    /** iframe URL (YouTube / Vimeo embed, etc.) or a video file */
    src: string;
    title: string;
    ratio?: number | string;
    /** true = <video>, false = <iframe> */
    native?: boolean;
    poster?: string;
  }>(),
  { ratio: "16 / 9", native: false },
);
</script>

<template>
  <div class="bless-video" :style="{ aspectRatio: ratio }">
    <video
      v-if="native"
      v-bind="$attrs"
      :src
      :poster
      :title
      class="bless-video__media"
      controls
      playsinline
    >
      <!-- <track kind="captions" …> and <source> elements go here -->
      <slot />
    </video>
    <iframe
      v-else
      v-bind="$attrs"
      :src
      :title
      class="bless-video__media"
      allow="
        accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture;
      "
      allowfullscreen
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </div>
</template>

<style>
.bless-video {
  border-radius: var(--bless-radius);
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--bless-color-media-bg);
}
.bless-video__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>
