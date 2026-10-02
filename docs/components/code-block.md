---
title: CodeBlock
---

<script setup>
import CodeBlockBasic from "../demos/CodeBlockBasic.vue";
</script>

# CodeBlock

<p class="bless-lead">Copy button, line highlight, tabs per file</p>

A listing the reader will copy from — an install command, an example, a config in two files. For two versions of the same text, use [Diff](./diff); for a short inline mention, plain `<code>` is enough.

<Demo title="Basic">
  <CodeBlockBasic />
  <template #code>

<<< ../demos/CodeBlockBasic.vue

  </template>
</Demo>

- Pass `code` (with `lang` and `filename` for the header) or `files` for tabs: `[{ name, code, lang }]`. Tabs switch with ← →, Home and End; `v-model:active` is the open one. Copy takes the file you are looking at.
- `lines="2,4-6"` marks lines with a bar and a tint (1-based; an array of numbers works too). `line-numbers` adds a gutter that is not read aloud and is left out when you select and copy.
- Long lines scroll sideways; `wrap` wraps them instead. The scroll area is reachable by keyboard.
- It does not colour syntax, and ships no highlighter. Fill the `#code="{ code, lang, lines }"` slot with the output of Shiki, Prism or whatever you use; the header, tabs and copy button stay. `lines` there is `[{ n, text, hl }]` if you want to keep the line marks.
- **Copy** uses the clipboard API and falls back to a hidden textarea; the button says "Copied" for two seconds and screen readers hear it. `copy` fires with the text, and `:copy="false"` removes the button.

## Usage

```ts
import { BlessCodeBlock } from "blessing-ui";
```

## API

<PropsTable name="BlessCodeBlock" />
