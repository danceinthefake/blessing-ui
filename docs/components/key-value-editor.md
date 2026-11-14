---
title: KeyValueEditor
---

<script setup>
import KeyValueEditorBasic from "../demos/KeyValueEditorBasic.vue";
</script>

# KeyValueEditor

<p class="bless-lead">Rows of key and value pairs to edit</p>

Edits a list of pairs, such as the headers of a request, environment variables, or the metadata of a file. To show pairs that people only read, use [descriptions](./descriptions). For a list of single words, use [input tags](./input-tags).

<Demo title="Basic">
  <KeyValueEditorBasic />
  <template #code>

<<< ../demos/KeyValueEditorBasic.vue

  </template>
</Demo>

- `v-model` is a list of `{ key, value, enabled }`. An empty row is always at the end. Type in it, and it becomes a row, and a new empty row shows.
- Each row has a remove button. After a remove, focus goes to the key of the row that takes its place, so the keyboard stays in the list.
- A key that is used more than once is marked on each of its rows, and a line under the list says so. The list still keeps the rows, so you decide what to do.
- `toggle` adds an on and off box to each row. A row that is off stays in the list with `enabled: false`, so people can turn a header off and on again without typing it again.
- `secret` hides the values, as a password field does.
- In a [field](./field), the field's label names the group. Each field in a row has a name with the row number, for example "Key 2".
- Change the words with `labels` or a [label pack](../guide/translating): `key`, `value`, `enabled`, `remove`, and `duplicate`.

## Usage

```ts
import { BlessKeyValueEditor, type BlessKeyValue } from "blessing-ui";
```

## API

<PropsTable name="BlessKeyValueEditor" />
