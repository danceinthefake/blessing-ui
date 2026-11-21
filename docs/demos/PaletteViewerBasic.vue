<template>
  <BlessPaletteViewer :palettes />
</template>

<script setup lang="ts">
import { BlessPaletteViewer } from "blessing-ui";

const palettes = [
  {
    name: "Megumi pink",
    shades: [
      { label: "50", value: "#fdf0f4" },
      { label: "100", value: "#fad6e1" },
      { label: "300", value: "#f08aa8" },
      { label: "500", value: "#d24b73" },
      { label: "700", value: "#9c2348" },
      { label: "900", value: "#5a1029" },
    ],
  },
  {
    name: "Gray",
    shades: [
      { label: "50", value: "#f6f6f7" },
      { label: "100", value: "#e7e8ea" },
      { label: "300", value: "#b8bbc1" },
      { label: "500", value: "#767b84" },
      { label: "700", value: "#43474e" },
      { label: "900", value: "#1d1f23" },
    ],
  },
];
</script>
