---
title: Editor
---

<script setup>
import EditorBasic from "../demos/EditorBasic.vue";
</script>

# Editor

<p class="bless-lead">Rich text: skewed toolbar around a Tiptap editor</p>

<Demo title="Basic">
  <EditorBasic />
  <template #code>

<<< ../demos/EditorBasic.vue

  </template>
</Demo>

## Install

Tiptap is an optional peer — the library only types against it and never imports it.

```sh
pnpm add @tiptap/vue-3 @tiptap/starter-kit @tiptap/pm
```

`BlessEditor` takes the `editor` from `useEditor()` and renders a token-styled toolbar; you place `<EditorContent :editor />` in the default slot. `tools` picks and orders the buttons; `#toolbar="{ editor }"` replaces them entirely.

## Usage

```ts
import { BlessEditor } from "blessing-ui";
```

## API

<PropsTable name="BlessEditor" />
