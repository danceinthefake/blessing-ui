<script setup lang="ts">
import { ref } from "vue";
import { BlessResizable } from "blessing-ui";
const split = ref(40);
</script>

<template>
  <div style="height: 200px; max-width: 720px; border: 1px solid var(--bless-color-border)">
    <BlessResizable v-model="split" :min="20" :max="80">
      <template #a>
        <div style="padding: 16px">
          Pane A — {{ split }}%<br /><small>drag, ← →, Home/End, dbl-click resets</small>
        </div>
      </template>
      <template #b>
        <BlessResizable direction="vertical">
          <template #a><div style="padding: 16px">Pane B1</div></template>
          <template #b><div style="padding: 16px">Pane B2 (nested vertical)</div></template>
        </BlessResizable>
      </template>
    </BlessResizable>
  </div>
</template>
