<script setup lang="ts">
import { BlessButton, BlessItem } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessItem title="第1話 — 冴えないヒロインの育てかた" description="24:00 · 2019.04.04">
      <template #media>▶</template>
      <template #actions><BlessButton size="sm" variant="outline">Play</BlessButton></template>
    </BlessItem>
    <BlessItem variant="outline" title="Blu-ray BOX" description="Pre-order open" href="#">
      <template #media>📀</template>
      <template #actions>→</template>
    </BlessItem>
    <BlessItem variant="surface" size="sm" title="Staff" description="Original: 丸戸史明" />
  </div>
</template>
