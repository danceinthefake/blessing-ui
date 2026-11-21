---
title: Glossary
---

# Glossary

<p class="bless-lead">A term with a dotted line that shows its meaning</p>

Explains a word in a line of text, without a link to another page. A hover or the focus on the term shows its meaning in a small tip. For a tip on a button or an icon, use the [tooltip](./tooltip).

<Demo title="Basic">
  <GlossaryBasic />
  <template #code>

<<< ../demos/GlossaryBasic.vue

  </template>
</Demo>

- Put the term in the default slot, and its meaning in `definition`. The term keeps the look of the text around it, with a dotted line under it.
- `term` shows a headword in the tip, for example "LUFS" for the text "−16 LUFS". Without it, the tip shows only the meaning.
- The tip is a [tooltip](./tooltip): it opens on hover and on focus, stays open while the pointer is on it, and Escape closes it. `placement` sets its side (default `top`).
- The term is a button, so the keyboard can reach it. Screen readers hear the meaning as the description of the term.
- Keep the meaning to a sentence or two. A tip cannot hold links or other controls.

## Usage

```ts
import { BlessGlossary } from "blessing-ui";
```

## API

<PropsTable name="BlessGlossary" />

<script setup>
import GlossaryBasic from "../demos/GlossaryBasic.vue";
</script>
