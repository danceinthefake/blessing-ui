<script setup lang="ts">
import { BlessLogoCloud } from "blessing-ui";

// made-up word marks drawn as SVG; use the real logo files of your customers
const mark = (name: string, color: string, shape: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48"><g fill="#${color}">${shape}</g><text x="52" y="31" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#${color}">${name}</text></svg>`,
  )}`;
const logos = [
  { name: "Gema Audio", src: mark("Gema Audio", "c2185b", '<circle cx="22" cy="24" r="16"/>') },
  {
    name: "Ruang Rekam",
    src: mark("Ruang Rekam", "1565c0", '<rect x="8" y="10" width="28" height="28"/>'),
  },
  { name: "Nada Kita", src: mark("Nada Kita", "2e7d32", '<path d="M22 6 40 40H4z"/>') },
  {
    name: "Suara Timur",
    src: mark(
      "Suara Timur",
      "e65100",
      '<path d="M6 24h32M22 8v32" stroke="#e65100" stroke-width="8"/>',
    ),
  },
  {
    name: "Podkast.id",
    src: mark("Podkast.id", "6a1b9a", '<rect x="8" y="8" width="28" height="32" rx="14"/>'),
  },
  {
    name: "Studio 45",
    src: mark("Studio 45", "00838f", '<path d="M8 8h28v8H16v8h20v16H8v-8h20v-8H8z"/>'),
  },
];
</script>

<template>
  <BlessLogoCloud :logos title="Used by 2,000 studios and podcasts in Indonesia" />
</template>
