<script setup lang="ts">
import { BlessVideo } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessVideo
      src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      title="Trailer"
      style="width: 360px"
    />
    <BlessVideo
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      title="Sample"
      native
      ratio="4 / 3"
      style="width: 240px"
    />
  </div>
</template>
