---
title: Editor
---

<script setup>
import EditorBasic from "../demos/EditorBasic.vue";
</script>

# Editor

<p class="bless-lead">Rich text: skewed toolbar around a Tiptap editor</p>

## When to use

A rich-text surface for the cases a `BlessTextarea` can't cover — headings, lists, code, quotes. The library ships the frame: a toolbar in the system's style and content typography from tokens. The engine is [Tiptap](https://tiptap.dev), which you install and configure yourself; the component only needs the `editor` from `useEditor()` and renders your `<EditorContent>` in its default slot.

Reach for it only when users must produce formatted text. For comments, notes and messages a textarea is lighter and easier to store.

```sh
pnpm add @tiptap/vue-3 @tiptap/starter-kit
```

`@tiptap/vue-3` is an optional peer of the library. `tools` is the toolbar, in order, with `"|"` as a separator; the `#toolbar` slot (`{ editor }`) replaces it entirely for custom buttons. The toolbar is a single tab stop — ← / → move between tools, Home / End jump — and each tool reports `aria-pressed`. Inside the writing area, Tiptap's own shortcuts apply (⌘B, ⌘I, …). `minHeight` sets the writing area; its typography reads the `--bless-*` tokens.

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
