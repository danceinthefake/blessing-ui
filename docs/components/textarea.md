---
title: Textarea
---

<script setup>
import TextareaBasic from "../demos/TextareaBasic.vue";
</script>

# Textarea

<p class="bless-lead">Auto-growing textarea</p>

Text longer than a line: a message, a note, a description. For one line use [Input](./input); for formatted text, [Editor](./editor).
<Demo title="Basic">
<TextareaBasic />
<template #code>

<<< ../demos/TextareaBasic.vue

  </template>
</Demo>

- `autogrow` (on by default) grows with the text where `field-sizing` is supported; elsewhere it stays at `rows` and scrolls.
- `counter` with `maxlength` shows `n / max`. It is read out only when the text is near the limit, not on every keystroke.
- In a form, wrap it in a [Field](./form); its own `description` and `error` are for a label-less textarea.

## Usage

```ts
import { BlessTextarea } from "blessing-ui";
```

## API

<PropsTable name="BlessTextarea" />
