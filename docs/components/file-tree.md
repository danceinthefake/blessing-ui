---
title: File tree
---

# File tree

<p class="bless-lead">Files and folders from a flat list of paths</p>

Shows the files of a project as folders that open and close, for example the files of an episode. You give a plain list of paths, and the component makes the folders. For a tree of any data, use the [tree](./tree), which this component uses.

<Demo title="Basic">
  <FileTreeBasic />
  <template #code>

<<< ../demos/FileTreeBasic.vue

  </template>
</Demo>

- `paths` is a list of paths such as `audio/ep41/raw.wav`. Each part before a `/` is a folder. A path that ends in `/` is an empty folder.
- Folders come first, then files, each in order of name. Each file has an icon for its type: image, audio, video, text, settings, archive, or other.
- `v-model:selected` is the path of the selected file or folder. The folders on the way to it start open. `expanded` opens every folder.
- A click on a name emits `select` with the path, and with `true` for a folder.
- The keys are the keys of the [tree](./tree): the up and down arrows move, the right arrow opens a folder, the left arrow closes it, and Enter selects. `label` names the tree for screen readers.

## Usage

```ts
import { BlessFileTree } from "blessing-ui";
```

## API

<PropsTable name="BlessFileTree" />

<script setup>
import FileTreeBasic from "../demos/FileTreeBasic.vue";
</script>
