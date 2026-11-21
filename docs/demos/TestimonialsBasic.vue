<template>
  <div style="display: grid; gap: 16px">
    <BlessToggleGroup v-model="layout" label="Layout">
      <BlessToggle value="grid">Grid</BlessToggle>
      <BlessToggle value="single">One at a time</BlessToggle>
    </BlessToggleGroup>
    <BlessTestimonials :items :layout />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessTestimonials, BlessToggle, BlessToggleGroup } from "blessing-ui";

const layout = ref<"grid" | "single">("grid");
const items = [
  {
    quote: "Every episode gives me one thing I can try in my own studio the same night.",
    name: "Rara Wijaya",
    role: "Host of Morning Brief",
    rating: 5,
  },
  {
    quote: "The wardrobe trick saved my first season. My room sounds like a real booth now.",
    name: "Yusuf Hakim",
    role: "Producer",
    rating: 5,
  },
  {
    quote: "Short, kind, and full of real numbers. I wish more shows were like this.",
    name: "Mei Lestari",
    role: "Listener since episode 1",
    rating: 4,
  },
];
</script>
