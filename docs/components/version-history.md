---
title: Version history
---

# Version history

<p class="bless-lead">Saved versions with the author and the time, and a restore button</p>

Lists the saved versions of a document, newest first. The reader can look at an old version and bring it back. To see the changes line by line, use the [diff](./diff) beside it.

<Demo title="Basic">
  <VersionHistoryBasic />
  <template #code>

<<< ../demos/VersionHistoryBasic.vue

  </template>
</Demo>

- `versions` is a list of versions, newest first. Each version has an `id`, an `author`, and a `time` as text. It can also have a `label`, an `avatar`, a `summary`, and the counts `added` and `removed`.
- The first version is the current one and has a "Current" tag. The other versions have a restore button that emits `restore` with the id.
- `v-model:selected` is the id of the version that the reader looks at. A click on a version sets it. With no value, the current version is the selected one.
- The counts show as "+12 −3". Screen readers hear them in words, such as "12 added, 3 removed".
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `current`, `restore`, and `changes` (a function of the two counts).

## Usage

```ts
import { BlessVersionHistory } from "blessing-ui";
```

## API

<PropsTable name="BlessVersionHistory" />

<script setup>
import VersionHistoryBasic from "../demos/VersionHistoryBasic.vue";
</script>
