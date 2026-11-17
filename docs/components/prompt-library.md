---
title: Prompt library
---

<script setup>
import PromptLibraryBasic from "../demos/PromptLibraryBasic.vue";
</script>

# Prompt library

<p class="bless-lead">Saved prompts with a search, tags, and fill-in fields</p>

Keeps the prompts that a person or a team uses often, so they do not type them again.

<Demo title="Basic">
  <PromptLibraryBasic />
  <template #code>

<<< ../demos/PromptLibraryBasic.vue

  </template>
</Demo>

- `prompts` is the list. Each prompt has an `id`, a `title`, a `text`, and optional `tags`.
- Write a field in the text as `{{name}}`. When a person picks the prompt, each field gets a text box, and the preview fills in as they type. An empty field keeps its `{{name}}`.
- The search looks in the titles, the texts, and the tags. The tag buttons show one tag at a time.
- "Use this prompt" emits `use` with the filled text and the prompt. Put the text in your [prompt input](./prompt-input).
- On a narrow screen, the detail goes below the list.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `promptFields` and `fillPrompt` functions do the work on the fields. They are exported for your own views.

## Usage

```ts
import { BlessPromptLibrary } from "blessing-ui";
```

## API

<PropsTable name="BlessPromptLibrary" />
