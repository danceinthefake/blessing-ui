---
title: FileInput
---

<script setup>
import FileInputBasic from "../demos/FileInputBasic.vue";
</script>

# FileInput

<p class="bless-lead">Native file input with drop zone</p>

A form field that takes files: click or drop, see what was picked, remove one. Submits with the form like any other field. When the files start uploading the moment they land — progress, retry, a queue — that is [Uploader](./uploader).

<Demo title="Basic">
  <FileInputBasic />
  <template #code>

<<< ../demos/FileInputBasic.vue

  </template>
</Demo>

- `label` here is the copy inside the zone. The field's own label comes from a `BlessField` around it, which also wires id, invalid and describedby.
- `accept` filters the picker **and** dropped files, so the hint you write is what gets in.
- The `v-model` is the truth. With `multiple`, picks accumulate and remove is per file, which the native `<input>` cannot mirror — on submit, append `files` to your `FormData` rather than reading the input.

## Usage

```ts
import { BlessFileInput } from "blessing-ui";
```

## API

<PropsTable name="BlessFileInput" />
