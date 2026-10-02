<script setup lang="ts">
import { BlessCodeBlock } from "blessing-ui";

const files = [
  {
    name: "main.ts",
    lang: "ts",
    code: `import { createApp } from "vue";
import { BlessButton } from "blessing-ui";
import "blessing-ui/tokens.css";

createApp(BlessButton).mount("#app");
`,
  },
  {
    name: "style.css",
    lang: "css",
    code: `:root {
  --bless-color-accent: #b63c5c;
}
`,
  },
];
</script>

<template>
  <div class="col">
    <BlessCodeBlock :files lines="4-5" line-numbers />
    <BlessCodeBlock filename="install" lang="sh" code="pnpm add blessing-ui vue" />
  </div>
</template>
