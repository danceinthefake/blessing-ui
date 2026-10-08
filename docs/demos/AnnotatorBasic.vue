<script setup lang="ts">
import { ref } from "vue";
import { BlessAnnotator, type BlessRegion } from "blessing-ui";

const marks = ref<BlessRegion[]>([
  { id: "r1", x: 0.08, y: 0.12, w: 0.34, h: 0.4, label: "Headline" },
  { id: "r2", x: 0.7, y: 0.3, label: "Logo" },
]);
const selected = ref<string | null>(null);
const tool = ref<"select" | "box" | "pin">("box");
</script>

<template>
  <div class="col" style="max-width: 640px">
    <BlessAnnotator
      v-model="marks"
      v-model:selected="selected"
      v-model:tool="tool"
      src="/preview-news.png"
      alt="A news page"
      label="Review marks"
    />
    <p style="margin: 0">{{ marks.length }} marks, saved as fractions of the image.</p>
  </div>
</template>
