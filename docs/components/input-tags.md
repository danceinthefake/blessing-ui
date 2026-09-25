---
title: InputTags
---

<script setup>
import InputTagsBasic from "../demos/InputTagsBasic.vue";
</script>

# InputTags

<p class="bless-lead">Free-text tags</p>

For labels the user makes up: keywords, topics, addresses to invite. When the values come from a known list, use [Combobox](./combobox) or a multiple [Select](./select) instead, so nobody types a tag that doesn't exist.

<Demo title="Basic">
  <InputTagsBasic />
  <template #code>

<<< ../demos/InputTagsBasic.vue

  </template>
</Demo>

- `separators` takes keys (`Enter`) and characters (`,`). Characters also split a paste and work on phone keyboards, which don't report the comma key.
- Backspace in an empty draft removes the last tag. Adds and removes are announced to screen readers.
- `max` stops adding at that many; `duplicates` allows the same tag twice.
- Inside a [Field](./form) the field's label names it; alone, pass `label`. `name` submits one value per tag, like a multiple select.

## Usage

```ts
import { BlessInputTags } from "blessing-ui";
```

## API

<PropsTable name="BlessInputTags" />
