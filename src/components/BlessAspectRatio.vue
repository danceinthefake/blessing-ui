<script setup lang="ts">
defineOptions({ name: "BlessAspectRatio" });

withDefaults(defineProps<{ ratio?: number | string }>(), { ratio: 16 / 9 });
</script>

<template>
  <div class="bless-aspect" :style="{ aspectRatio: String(ratio) }"><slot /></div>
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
</style>
