<script setup lang="ts">
import { BlessButton, BlessPanel } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessPanel title="On air" style="width: 300px">
      TOKYO MX 木曜 24:00〜 · BS11 金曜 23:30〜
      <template #footer>updated 2019.09.25</template>
    </BlessPanel>
    <BlessPanel title="Staff" toggleable surface="surface" style="width: 300px">
      <template #actions><BlessButton size="sm" variant="ghost">edit</BlessButton></template>
      原作：丸戸史明 · 監督：亀井幹太
    </BlessPanel>
  </div>
</template>
