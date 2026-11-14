---
title: Markdown
---

<script setup>
import MarkdownBasic from "../demos/MarkdownBasic.vue";
</script>

# Markdown

<p class="bless-lead">Markdown text, safely rendered</p>

Shows Markdown text, such as a comment, a release note, or a message from a model, with the type of the library. Edit the text on the left to see it change. For code with a copy button and line numbers, use the [code block](./code-block). To let people write rich text, use the [editor](./editor).

<Demo title="Basic">
  <MarkdownBasic />
  <template #code>

<<< ../demos/MarkdownBasic.vue

  </template>
</Demo>

- Install [marked](https://marked.js.org/) and pass its `lexer`: `import { lexer } from "marked"`. The library never loads marked itself, so an app that does not use this component needs no marked.
- The component builds each element itself and never sets HTML from the text. Raw HTML in the text, such as `<script>`, shows as the text that was written.
- Only `http:`, `https:`, `mailto:`, `tel:`, and relative links become links, and only those images load. Other links, such as `javascript:`, keep their text and do not link.
- A link to a path in your app, such as `/docs`, uses your router when you [provide its link component](../guide/install#with-a-router). A link to another site opens in a new tab.
- `level` sets the HTML level of a `#` heading (default 2), so the text does not add a second `<h1>` to your page. Deeper headings follow, up to `<h6>`.
- It supports GFM: tables with column alignment, task lists (as disabled checkboxes), and ~~strikethrough~~.
- Code blocks get a `language-*` class, so you can add a highlighter. The component does not color code.

## Usage

```ts
import { BlessMarkdown } from "blessing-ui";
import { lexer } from "marked";
```

## API

<PropsTable name="BlessMarkdown" />
