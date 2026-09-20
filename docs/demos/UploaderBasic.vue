<script setup lang="ts">
import { BlessUploader, type BlessUpload } from "blessing-ui";
// no `url` → handle each file yourself; here a fake 1.5s upload
function upload(
  item: BlessUpload,
  progress: (n: number) => void,
  done: () => void,
  fail: (m?: string) => void,
) {
  let p = 0;
  const t = setInterval(() => {
    p += 12;
    progress(p);
    if (p >= 100) {
      clearInterval(t);
      item.file.name.endsWith(".exe") ? fail("Blocked type") : done();
    }
  }, 150);
}
</script>

<template>
  <div style="max-width: 480px">
    <BlessUploader
      :max-size="5 * 1024 * 1024"
      accept="image/*,.pdf,.exe"
      hint="≤ 5 MB · .exe fails on purpose"
      @upload="upload"
    />
  </div>
</template>
