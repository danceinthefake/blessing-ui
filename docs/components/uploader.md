---
title: Uploader
---

<script setup>
import UploaderBasic from "../demos/UploaderBasic.vue";
</script>

# Uploader

<p class="bless-lead">Queue, progress, cancel: XHR or your own</p>

Files that upload on their own, with progress, before the form is sent: attachments, a photo set, a batch import. If the files go with the form on submit, use [FileInput](./file-input).

<Demo title="Basic">
  <UploaderBasic />
  <template #code>

<<< ../demos/UploaderBasic.vue

  </template>
</Demo>

- With `url` it POSTs each file (as `field`, with `headers`) and tracks progress. Without it, handle `@upload` yourself: call `progress(n)`, then `done()` or `fail(message)`.
- `auto` starts as soon as files are picked. Otherwise the Upload button does. `maxSize` rejects large files before they are sent.
- Finished and failed uploads are announced. Each row's button names its file. Leaving the page, or unmounting, stops uploads in progress.

## Usage

```ts
import { BlessUploader } from "blessing-ui";
```

## API

<PropsTable name="BlessUploader" />
