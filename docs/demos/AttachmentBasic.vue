<script setup lang="ts">
import { BlessAttachment } from "blessing-ui";
import { shots } from "./_data";
</script>

<template>
  <div class="row">
    <BlessAttachment name="script_ep03.pdf" description="212 KB" removable />
    <BlessAttachment name="storyboard.png" description="1.4 MB" :src="shots[5].src" href="#" />
    <BlessAttachment name="upload.zip" description="uploading…" state="uploading" :progress="62" />
    <BlessAttachment name="raw.mov" state="uploading" size="sm" />
    <BlessAttachment name="bad.exe" state="error" removable />
  </div>
</template>
