<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCard, BlessInfiniteCanvas, type CanvasView } from "blessing-ui";

const view = ref<CanvasView>({ x: 40, y: 40, zoom: 1 });
const canvas = ref<InstanceType<typeof BlessInfiniteCanvas>>();
const notes = [
  { x: 0, y: 0, text: "Intro" },
  { x: 260, y: 40, text: "Plot" },
  { x: 120, y: 220, text: "Characters" },
  { x: 560, y: 300, text: "Ending" },
];
</script>

<template>
  <div class="col" style="max-width: none">
    <div class="row">
      <BlessButton size="sm" @click="canvas?.fit({ x: 0, y: 0, width: 760, height: 380 })"
        >Fit all</BlessButton
      >
      <BlessButton size="sm" variant="outline" @click="canvas?.centerOn(660, 340)"
        >Go to Ending</BlessButton
      >
      <span
        >{{ Math.round(view.zoom * 100) }}% at {{ Math.round(view.x) }},
        {{ Math.round(view.y) }}</span
      >
    </div>
    <BlessInfiniteCanvas ref="canvas" v-model:view="view" label="Story board" style="height: 360px">
      <BlessCard
        v-for="n in notes"
        :key="n.text"
        :style="{ position: 'absolute', left: `${n.x}px`, top: `${n.y}px`, width: '180px' }"
      >
        {{ n.text }}
      </BlessCard>
    </BlessInfiniteCanvas>
  </div>
</template>
