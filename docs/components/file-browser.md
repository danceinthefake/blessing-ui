---
title: File browser
---

<script setup>
import FileBrowserBasic from "../demos/FileBrowserBasic.vue";
</script>

# File browser

<p class="bless-lead">The files and folders of one folder as a grid or a list, with a path to go back</p>

Shows the content of a folder in a file store or a shared drive. For the whole tree of folders in a side bar, use the [file tree](./file-tree).

<Demo title="Basic">
  <FileBrowserBasic />
  <template #code>

<<< ../demos/FileBrowserBasic.vue

  </template>
</Demo>

- `items` is the content of the folder. Each item has an `id`, a `name`, and optional `folder`, `size` in bytes, and `modified` date.
- Folders come first. Names sort in natural order, so "notes 9" comes before "notes 10".
- `v-model:view` is `grid` or `list`. The grid shows a folder or a page with the file extension. The list is a table with the date and the size.
- A click on an item emits `open`. If it is a folder, show its content and add it to `path`.
- `path` is the list of folders from the top to this one. A click on a folder in the path emits `navigate` with its id.
- `locale` formats the sizes and the dates. The dates show in UTC, so the server and the browser agree.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessFileBrowser } from "blessing-ui";
```

## API

<PropsTable name="BlessFileBrowser" />
