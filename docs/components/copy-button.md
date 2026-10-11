---
title: CopyButton
---

<script setup>
import CopyButtonBasic from "../demos/CopyButtonBasic.vue";
</script>

# CopyButton

<p class="bless-lead">Copy text with a Copied state</p>

A button that copies a text and says so. Use it beside a command, a token, an ID, or a link that people paste somewhere else.

<Demo title="Basic">
  <CopyButtonBasic />
  <template #code>

<<< ../demos/CopyButtonBasic.vue

  </template>
</Demo>

- `value` is the text. The component uses the Clipboard API and falls back to a hidden textarea where the API is missing.
- The label changes to "Copied" for `timeout` ms (default 2000). A polite live region next to the button says "Copied to clipboard". The region is not part of the button name.
- `labels` replaces the three English strings. The default slot replaces the button content and gets `copied`.
- `copy` fires with the copied text. [CodeBlock](./code-block) uses the same helper for its own copy button.

## Usage

```ts
import { BlessCopyButton } from "blessing-ui";
```

## API

<PropsTable name="BlessCopyButton" />
