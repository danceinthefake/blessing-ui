<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessTextarea v-model="source" aria-label="Markdown" :rows="16" />
    </div>
    <div class="col">
      <BlessMarkdown :source :lexer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { lexer } from "marked";
import { BlessMarkdown, BlessTextarea } from "blessing-ui";

const source = ref(
  `# Episode 12

Megumi's **final route** is set. Notes from the *script meeting*:

- [x] Rewrite the ending
- [ ] Check the art with Eriri
- Read the [schedule](/components/scheduler) and the [studio site](https://example.com)

> A heroine who does not stand out is still a heroine.

| Day | Task | Hours |
|-----|------|------:|
| Mon | Script | 6 |
| Tue | Art | 8 |

\`\`\`ts
const route = "Megumi";
\`\`\`

<script>alert("raw HTML stays text")</` + `script>`,
);
</script>
