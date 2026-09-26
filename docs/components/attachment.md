---
title: Attachment
---

<script setup>
import AttachmentBasic from "../demos/AttachmentBasic.vue";
</script>

# Attachment

<p class="bless-lead">File / image chip</p>

A file in a conversation or a form — its name, type, size, a preview, upload progress. For picking files, [FileInput](./file-input) or [Uploader](./uploader).

<Demo title="Basic">
  <AttachmentBasic />
  <template #code>

<<< ../demos/AttachmentBasic.vue

  </template>
</Demo>

- With `href` the name is a link that covers the whole card; the remove button and `#actions` sit above it, so each stays its own control. Remove says which file; when you take the attachment away on `@remove`, move focus to its neighbour, as with [Chip](./chip).
- `state` shows `uploading` (with `progress`, or a spinner) and `error`.

## Usage

```ts
import { BlessAttachment } from "blessing-ui";
```

## API

<PropsTable name="BlessAttachment" />
