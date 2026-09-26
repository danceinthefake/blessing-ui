<script setup lang="ts">
import { BlessAspectRatio } from "blessing-ui";
import { shots } from "./_data";
// an embed with nothing external: a page written inline
const embed = `<body style="margin:0;display:grid;place-items:center;height:100vh;background:#a759ff;color:#fff;font:16px sans-serif">embed</body>`;
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <figure class="ar">
      <BlessAspectRatio :ratio="16 / 9" style="width: 240px"
        ><img :src="shots[1].src" :alt="shots[1].alt"
      /></BlessAspectRatio>
      <figcaption>16 / 9</figcaption>
    </figure>
    <figure class="ar">
      <BlessAspectRatio :ratio="1" style="width: 135px"
        ><img :src="shots[2].src" :alt="shots[2].alt"
      /></BlessAspectRatio>
      <figcaption>1</figcaption>
    </figure>
    <figure class="ar">
      <BlessAspectRatio ratio="4 / 5" style="width: 108px"
        ><iframe title="Embedded page" :srcdoc="embed"
      /></BlessAspectRatio>
      <figcaption>4 / 5 · iframe</figcaption>
    </figure>
    <figure class="ar">
      <BlessAspectRatio
        :ratio="1"
        fit="contain"
        style="width: 135px; background: var(--bless-color-surface)"
        ><img :src="shots[1].src" :alt="shots[1].alt"
      /></BlessAspectRatio>
      <figcaption>1 · contain</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.ar {
  margin: 0;
}
.ar figcaption {
  margin-top: var(--bless-space-1);
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
</style>
